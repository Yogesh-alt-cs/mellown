export type Category = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  quizzes: number;
  difficulty: "Easy" | "Medium" | "Hard";
};

export const categories: Category[] = [
  {
    id: "engineering",
    name: "Engineering",
    emoji: "⚙️",
    description: "Circuits, code, structures & systems.",
    color: "#EAFF00",
    quizzes: 42,
    difficulty: "Hard",
  },
  {
    id: "general",
    name: "General Knowledge",
    emoji: "🧠",
    description: "A bit of everything — test your trivia.",
    color: "#FFD1DC",
    quizzes: 86,
    difficulty: "Medium",
  },
  {
    id: "anime",
    name: "Anime",
    emoji: "🍙",
    description: "From Shonen classics to modern hits.",
    color: "#A6F0C6",
    quizzes: 57,
    difficulty: "Easy",
  },
  {
    id: "science",
    name: "Science",
    emoji: "🧪",
    description: "Atoms, oceans, galaxies & beyond.",
    color: "#BFDBFE",
    quizzes: 33,
    difficulty: "Medium",
  },
  {
    id: "history",
    name: "History",
    emoji: "🏛️",
    description: "Empires, revolutions, hidden tales.",
    color: "#FCD9A8",
    quizzes: 28,
    difficulty: "Medium",
  },
  {
    id: "music",
    name: "Music",
    emoji: "🎧",
    description: "Lyrics, eras, artists, beats.",
    color: "#E9D5FF",
    quizzes: 19,
    difficulty: "Easy",
  },
];

export type Question = {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
};

export const sampleQuiz: { title: string; questions: Question[] } = {
  title: "General Knowledge: Warmup",
  questions: [
    {
      q: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Mercury"],
      correct: 1,
      explanation: "Mars looks red due to iron oxide (rust) on its surface.",
    },
    {
      q: "Who painted the Mona Lisa?",
      options: ["Van Gogh", "Picasso", "Da Vinci", "Michelangelo"],
      correct: 2,
      explanation: "Leonardo da Vinci painted it between 1503 and 1519.",
    },
    {
      q: "What is the smallest prime number?",
      options: ["0", "1", "2", "3"],
      correct: 2,
      explanation: "2 is the smallest — and only even — prime number.",
    },
    {
      q: "Which language has the most native speakers?",
      options: ["English", "Spanish", "Hindi", "Mandarin Chinese"],
      correct: 3,
      explanation: "Mandarin Chinese has the most native speakers worldwide.",
    },
    {
      q: "What gas do plants absorb from the atmosphere?",
      options: ["Oxygen", "Hydrogen", "Carbon Dioxide", "Nitrogen"],
      correct: 2,
      explanation: "Plants absorb CO₂ for photosynthesis and release oxygen.",
    },
  ],
};

export const leaderboard = [
  { rank: 1, name: "Aiko M.", score: 9820, streak: 31, emoji: "🦊" },
  { rank: 2, name: "Marcus T.", score: 9512, streak: 24, emoji: "🐺" },
  { rank: 3, name: "Priya R.", score: 9340, streak: 18, emoji: "🦁" },
  { rank: 4, name: "Diego H.", score: 8870, streak: 14, emoji: "🐯" },
  { rank: 5, name: "Lena K.", score: 8612, streak: 12, emoji: "🐻" },
  { rank: 6, name: "Sam O.", score: 8205, streak: 9, emoji: "🐼" },
  { rank: 7, name: "Yuki S.", score: 7990, streak: 7, emoji: "🐨" },
];
