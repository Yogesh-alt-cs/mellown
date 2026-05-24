import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type LeaderboardPeriod = "global" | "weekly";

export type LeaderboardPlayer = {
  user_id: string;
  score: number;
  display_name: string;
  avatar_emoji: string;
  quizzes: number;
  correct: number;
  total: number;
  accuracy: number;
  streak: number;
};

export async function loadLeaderboard(period: LeaderboardPeriod): Promise<LeaderboardPlayer[]> {
  let query = supabaseAdmin
    .from("quiz_results")
    .select("user_id, score, correct, total, created_at")
    .order("created_at", { ascending: false })
    .limit(1000);

  if (period === "weekly") {
    query = query.gte("created_at", new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString());
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const totals = new Map<string, { score: number; quizzes: number; correct: number; total: number; days: Set<string> }>();
  for (const r of data ?? []) {
    const current = totals.get(r.user_id) ?? { score: 0, quizzes: 0, correct: 0, total: 0, days: new Set<string>() };
    current.score += r.score ?? 0;
    current.quizzes += 1;
    current.correct += r.correct ?? 0;
    current.total += r.total ?? 0;
    current.days.add(new Date(r.created_at).toDateString());
    totals.set(r.user_id, current);
  }

  const sorted = [...totals.entries()].sort((a, b) => b[1].score - a[1].score).slice(0, 20);
  if (sorted.length === 0) return [];

  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("id, display_name, avatar_emoji")
    .in("id", sorted.map(([id]) => id));

  const pmap = new Map((profiles ?? []).map((p) => [p.id, p]));
  return sorted.map(([user_id, data]) => ({
    user_id,
    score: data.score,
    display_name: pmap.get(user_id)?.display_name ?? "Player",
    avatar_emoji: pmap.get(user_id)?.avatar_emoji ?? "🎯",
    quizzes: data.quizzes,
    correct: data.correct,
    total: data.total,
    accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    streak: calculateStreak(data.days),
  }));
}

function calculateStreak(days: Set<string>) {
  let streak = 0;
  const cursor = new Date();
  while (days.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}