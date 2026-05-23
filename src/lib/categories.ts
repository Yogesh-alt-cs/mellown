export type Category = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  topicSeed: string;
  difficulty: "Easy" | "Medium" | "Hard";
  group: string;
};

const C = {
  lavender: "#D7C6FF",
  yellow: "#EAFF00",
  pink: "#FFD1DC",
  mint: "#A6F0C6",
  peach: "#FCD9A8",
  blue: "#BFDBFE",
  purple: "#E9D5FF",
  rose: "#FECACA",
  cream: "#FFF4D6",
  sky: "#CFF1FF",
  lime: "#E2F5A1",
  coral: "#FFCBB4",
};

export const categories: Category[] = [
  // Science
  { id: "science", name: "Science", emoji: "🧪", description: "All sciences", color: C.mint, topicSeed: "general science across physics biology chemistry astronomy", difficulty: "Medium", group: "Science" },
  { id: "physics", name: "Physics", emoji: "⚛️", description: "Laws of nature", color: C.blue, topicSeed: "physics mechanics electromagnetism quantum thermodynamics", difficulty: "Hard", group: "Science" },
  { id: "chemistry", name: "Chemistry", emoji: "🧬", description: "Atoms & reactions", color: C.lime, topicSeed: "chemistry elements reactions organic inorganic", difficulty: "Medium", group: "Science" },
  { id: "biology", name: "Biology", emoji: "🌿", description: "Life sciences", color: C.mint, topicSeed: "biology cells genetics evolution anatomy ecology", difficulty: "Medium", group: "Science" },
  { id: "math", name: "Mathematics", emoji: "➗", description: "Numbers & logic", color: C.peach, topicSeed: "mathematics algebra geometry calculus statistics", difficulty: "Hard", group: "Science" },
  { id: "space", name: "Space", emoji: "🚀", description: "Cosmos & astronomy", color: C.purple, topicSeed: "astronomy planets stars galaxies space exploration", difficulty: "Medium", group: "Science" },

  // Tech
  { id: "coding", name: "Coding", emoji: "💻", description: "Programming basics", color: C.lavender, topicSeed: "programming fundamentals algorithms data structures", difficulty: "Medium", group: "Tech" },
  { id: "languages", name: "Languages", emoji: "🐍", description: "Python, JS, more", color: C.yellow, topicSeed: "programming languages python javascript typescript java c++", difficulty: "Medium", group: "Tech" },
  { id: "ai", name: "AI & ML", emoji: "🤖", description: "Machine learning", color: C.sky, topicSeed: "artificial intelligence machine learning neural networks", difficulty: "Hard", group: "Tech" },
  { id: "cyber", name: "Cyber Security", emoji: "🛡️", description: "Hacking & defense", color: C.rose, topicSeed: "cyber security cryptography network security attacks", difficulty: "Hard", group: "Tech" },
  { id: "cs", name: "Computer Science", emoji: "🖥️", description: "Theory of computing", color: C.lavender, topicSeed: "computer science theory operating systems compilers", difficulty: "Hard", group: "Tech" },
  { id: "tech", name: "Technology", emoji: "📱", description: "Gadgets & trends", color: C.sky, topicSeed: "modern technology gadgets internet companies trends", difficulty: "Easy", group: "Tech" },
  { id: "startups", name: "Startups", emoji: "🦄", description: "Founders & VC", color: C.cream, topicSeed: "famous startups founders venture capital tech history", difficulty: "Medium", group: "Tech" },
  { id: "engineering", name: "Engineering", emoji: "⚙️", description: "Systems & design", color: C.lavender, topicSeed: "engineering disciplines mechanical electrical civil", difficulty: "Hard", group: "Tech" },

  // Entertainment
  { id: "anime", name: "Anime", emoji: "🍙", description: "Shonen to seinen", color: C.pink, topicSeed: "popular anime series characters and storylines", difficulty: "Easy", group: "Entertainment" },
  { id: "manga", name: "Manga", emoji: "📖", description: "Japanese comics", color: C.peach, topicSeed: "manga series authors and storylines", difficulty: "Medium", group: "Entertainment" },
  { id: "onepiece", name: "One Piece", emoji: "🏴‍☠️", description: "Straw Hat crew", color: C.coral, topicSeed: "One Piece anime and manga characters arcs and lore", difficulty: "Medium", group: "Entertainment" },
  { id: "naruto", name: "Naruto", emoji: "🍥", description: "Hidden Leaf", color: C.peach, topicSeed: "Naruto and Boruto anime characters jutsu and lore", difficulty: "Medium", group: "Entertainment" },
  { id: "marvel", name: "Marvel", emoji: "🦸", description: "MCU & comics", color: C.rose, topicSeed: "Marvel comics and MCU movies characters", difficulty: "Easy", group: "Entertainment" },
  { id: "dc", name: "DC", emoji: "🦇", description: "DC universe", color: C.blue, topicSeed: "DC comics characters and movies", difficulty: "Easy", group: "Entertainment" },
  { id: "movies", name: "Movies", emoji: "🎬", description: "Cinema classics", color: C.purple, topicSeed: "famous movies directors actors and film history", difficulty: "Easy", group: "Entertainment" },
  { id: "music", name: "Music", emoji: "🎧", description: "Eras & artists", color: C.blue, topicSeed: "music history genres artists and famous songs", difficulty: "Easy", group: "Entertainment" },
  { id: "kpop", name: "K-pop", emoji: "🎤", description: "Idols & groups", color: C.pink, topicSeed: "K-pop groups idols songs and Korean music industry", difficulty: "Medium", group: "Entertainment" },
  { id: "gaming", name: "Gaming", emoji: "🎮", description: "Video games", color: C.lavender, topicSeed: "video games consoles franchises and esports", difficulty: "Easy", group: "Entertainment" },
  { id: "valorant", name: "Valorant", emoji: "🔫", description: "Agents & maps", color: C.rose, topicSeed: "Valorant agents abilities maps and esports", difficulty: "Medium", group: "Entertainment" },
  { id: "minecraft", name: "Minecraft", emoji: "🧱", description: "Blocks & mobs", color: C.mint, topicSeed: "Minecraft items mobs biomes and game mechanics", difficulty: "Easy", group: "Entertainment" },

  // Sports
  { id: "sports", name: "Sports", emoji: "⚽", description: "Athletes & events", color: C.rose, topicSeed: "sports athletes championships and rules", difficulty: "Medium", group: "Sports" },
  { id: "cricket", name: "Cricket", emoji: "🏏", description: "Bat & ball", color: C.lime, topicSeed: "cricket players matches records and tournaments", difficulty: "Medium", group: "Sports" },
  { id: "football", name: "Football", emoji: "🥅", description: "Soccer world", color: C.mint, topicSeed: "football soccer clubs players world cup leagues", difficulty: "Easy", group: "Sports" },

  // World
  { id: "general", name: "General Knowledge", emoji: "🧠", description: "Bit of everything", color: C.yellow, topicSeed: "general knowledge trivia across world history geography culture", difficulty: "Medium", group: "World" },
  { id: "geography", name: "Geography", emoji: "🌍", description: "Maps & lands", color: C.sky, topicSeed: "world geography countries capitals rivers and mountains", difficulty: "Medium", group: "World" },
  { id: "history", name: "History", emoji: "🏛️", description: "Empires & events", color: C.peach, topicSeed: "world history from ancient civilizations to modern era", difficulty: "Medium", group: "World" },
  { id: "current", name: "Current Affairs", emoji: "📰", description: "Recent events", color: C.cream, topicSeed: "recent world news current affairs politics economy", difficulty: "Medium", group: "World" },
  { id: "art", name: "Art", emoji: "🎨", description: "Painters & styles", color: C.pink, topicSeed: "art history famous painters movements and works", difficulty: "Medium", group: "World" },
  { id: "english", name: "English", emoji: "📚", description: "Grammar & vocab", color: C.cream, topicSeed: "English language grammar vocabulary and literature", difficulty: "Easy", group: "World" },

  // Business
  { id: "business", name: "Business", emoji: "💼", description: "Companies & trade", color: C.peach, topicSeed: "business management famous companies and corporate history", difficulty: "Medium", group: "Business" },
  { id: "finance", name: "Finance", emoji: "💰", description: "Markets & money", color: C.lime, topicSeed: "finance investing stock markets and economics", difficulty: "Hard", group: "Business" },
  { id: "entrepreneur", name: "Entrepreneurship", emoji: "🚀", description: "Founder mindset", color: C.cream, topicSeed: "entrepreneurship startup principles famous founders", difficulty: "Medium", group: "Business" },

  // Exams
  { id: "aptitude", name: "Aptitude", emoji: "🧮", description: "Quant & verbal", color: C.peach, topicSeed: "quantitative aptitude problems for placements and exams", difficulty: "Medium", group: "Exams" },
  { id: "reasoning", name: "Logical Reasoning", emoji: "🧩", description: "Puzzles & logic", color: C.lavender, topicSeed: "logical reasoning puzzles and analytical questions", difficulty: "Medium", group: "Exams" },
  { id: "jee", name: "JEE", emoji: "📐", description: "Engineering entrance", color: C.blue, topicSeed: "JEE physics chemistry mathematics entrance exam questions", difficulty: "Hard", group: "Exams" },
  { id: "neet", name: "NEET", emoji: "🩺", description: "Medical entrance", color: C.mint, topicSeed: "NEET biology chemistry physics medical entrance questions", difficulty: "Hard", group: "Exams" },
  { id: "upsc", name: "UPSC", emoji: "🏛️", description: "Civil services", color: C.cream, topicSeed: "UPSC civil services general studies polity geography history", difficulty: "Hard", group: "Exams" },
  { id: "competitive", name: "Competitive Exams", emoji: "🎯", description: "General prep", color: C.yellow, topicSeed: "general competitive exam questions mixed topics", difficulty: "Medium", group: "Exams" },
];

export const categoryGroups = Array.from(new Set(categories.map((c) => c.group)));
