import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const QuestionSchema = z.object({
  q: z.string(),
  options: z.array(z.string()).length(4),
  correct: z.number().int().min(0).max(3),
  explanation: z.string(),
});

export type GeneratedQuestion = z.infer<typeof QuestionSchema>;

const Input = z.object({
  topic: z.string().min(2).max(120),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).default("Medium"),
  count: z.number().int().min(3).max(50).default(10),
});

export const generateQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI is not configured");

    const systemPrompt = `You are an expert quiz writer. Generate engaging, factually correct multiple-choice questions. Each question must have exactly 4 options and one correct answer. Keep questions concise, varied, and at the requested difficulty.`;

    const userPrompt = `Generate ${data.count} ${data.difficulty} multiple-choice quiz questions about: "${data.topic}". Return them via the create_quiz tool.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_quiz",
              description: "Return the generated quiz questions.",
              parameters: {
                type: "object",
                properties: {
                  questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        q: { type: "string", description: "The question text" },
                        options: {
                          type: "array",
                          items: { type: "string" },
                          minItems: 4,
                          maxItems: 4,
                        },
                        correct: {
                          type: "integer",
                          minimum: 0,
                          maximum: 3,
                          description: "Index of the correct option (0-3)",
                        },
                        explanation: {
                          type: "string",
                          description: "Short explanation of the correct answer",
                        },
                      },
                      required: ["q", "options", "correct", "explanation"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["questions"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "create_quiz" } },
      }),
    });

    if (resp.status === 429) {
      throw new Error("Too many requests — please try again in a moment.");
    }
    if (resp.status === 402) {
      throw new Error("AI credits exhausted. Please top up in workspace settings.");
    }
    if (!resp.ok) {
      const text = await resp.text();
      console.error("AI gateway error", resp.status, text);
      throw new Error("Failed to generate quiz");
    }

    const json = await resp.json();
    const toolCall = json?.choices?.[0]?.message?.tool_calls?.[0];
    const argsStr = toolCall?.function?.arguments;
    if (!argsStr) throw new Error("No quiz returned by AI");
    const parsed = JSON.parse(argsStr) as { questions: unknown };
    const result = z.object({ questions: z.array(QuestionSchema).min(1) }).parse(parsed);

    return { topic: data.topic, difficulty: data.difficulty, questions: result.questions };
  });

const SaveInput = z.object({
  topic: z.string().min(1).max(160),
  category: z.string().max(80).optional(),
  score: z.number().int().min(0),
  correct: z.number().int().min(0),
  total: z.number().int().min(1),
});

export const saveQuizResult = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => SaveInput.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("quiz_results").insert({
      user_id: userId,
      topic: data.topic,
      category: data.category ?? null,
      score: data.score,
      correct: data.correct,
      total: data.total,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getMyStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: results }, { data: profile }] = await Promise.all([
      supabase
        .from("quiz_results")
        .select("score, correct, total, topic, category, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50),
      supabase.from("profiles").select("display_name, avatar_emoji").eq("id", userId).single(),
    ]);
    const list = results ?? [];
    const totalScore = list.reduce((s, r) => s + (r.score ?? 0), 0);
    const totalCorrect = list.reduce((s, r) => s + (r.correct ?? 0), 0);
    const totalQuestions = list.reduce((s, r) => s + (r.total ?? 0), 0);
    return {
      profile: profile ?? null,
      totalScore,
      totalQuizzes: list.length,
      accuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
      recent: list.slice(0, 10),
    };
  });

const ProfileInput = z.object({
  display_name: z.string().min(1).max(40).optional(),
  avatar_emoji: z.string().min(1).max(8).optional(),
});

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => ProfileInput.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const patch: { display_name?: string; avatar_emoji?: string } = {};
    if (data.display_name) patch.display_name = data.display_name;
    if (data.avatar_emoji) patch.avatar_emoji = data.avatar_emoji;
    const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getLeaderboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    // Aggregate top players by total score in the last 30 days
    const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
    const { data, error } = await supabase
      .from("quiz_results")
      .select("user_id, score")
      .gte("created_at", since);
    if (error) throw new Error(error.message);
    const totals = new Map<string, number>();
    for (const r of data ?? []) {
      totals.set(r.user_id, (totals.get(r.user_id) ?? 0) + (r.score ?? 0));
    }
    const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);
    if (sorted.length === 0) return [] as Array<{ user_id: string; score: number; display_name: string | null; avatar_emoji: string | null }>;
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_emoji")
      .in("id", sorted.map(([id]) => id));
    const pmap = new Map((profiles ?? []).map((p) => [p.id, p]));
    return sorted.map(([user_id, score]) => ({
      user_id,
      score,
      display_name: pmap.get(user_id)?.display_name ?? "Player",
      avatar_emoji: pmap.get(user_id)?.avatar_emoji ?? "🎯",
    }));
  });
