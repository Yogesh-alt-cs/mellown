export type Category = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  topicSeed: string;
  difficulty: "Easy" | "Medium" | "Hard";
};

export const categories: Category[] = [
  {
    id: "engineering",
    name: "Engineering",
    emoji: "⚙️",
    description: "Circuits, code, systems.",
    color: "#D7C6FF",
    topicSeed: "fundamentals of engineering, computer science, and mathematics",
    difficulty: "Hard",
  },
  {
    id: "general",
    name: "General Knowledge",
    emoji: "🧠",
    description: "A bit of everything.",
    color: "#EAFF00",
    topicSeed: "general knowledge trivia across world history, geography, and culture",
    difficulty: "Medium",
  },
  {
    id: "anime",
    name: "Anime",
    emoji: "🍙",
    description: "Shonen to seinen.",
    color: "#FFD1DC",
    topicSeed: "popular anime and manga series characters and storylines",
    difficulty: "Easy",
  },
  {
    id: "science",
    name: "Science",
    emoji: "🧪",
    description: "Atoms to galaxies.",
    color: "#A6F0C6",
    topicSeed: "physics, biology, chemistry and astronomy",
    difficulty: "Medium",
  },
  {
    id: "history",
    name: "History",
    emoji: "🏛️",
    description: "Empires & events.",
    color: "#FCD9A8",
    topicSeed: "world history from ancient civilizations to modern era",
    difficulty: "Medium",
  },
  {
    id: "music",
    name: "Music",
    emoji: "🎧",
    description: "Eras & artists.",
    color: "#BFDBFE",
    topicSeed: "music history, genres, artists and famous songs",
    difficulty: "Easy",
  },
  {
    id: "movies",
    name: "Movies",
    emoji: "🎬",
    description: "Cinema classics.",
    color: "#E9D5FF",
    topicSeed: "famous movies, directors, actors and film history",
    difficulty: "Easy",
  },
  {
    id: "sports",
    name: "Sports",
    emoji: "⚽",
    description: "Athletes & events.",
    color: "#FECACA",
    topicSeed: "sports, athletes, championships and rules",
    difficulty: "Medium",
  },
];
