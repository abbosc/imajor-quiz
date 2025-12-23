export type CategoryKey = 'tech' | 'health' | 'business' | 'science' | 'education' | 'law' | 'arts' | 'media';

export interface CareerQuizOption {
  text: string;
  scores: Partial<Record<CategoryKey, number>>;
}

export interface CareerQuizQuestion {
  id: number;
  question: string;
  options: CareerQuizOption[];
}

export const categoryInfo: Record<CategoryKey, { name: string; slug: string; color: string }> = {
  tech: { name: 'Technology & Engineering', slug: 'technology-engineering', color: '#3B82F6' },
  health: { name: 'Healthcare & Medicine', slug: 'healthcare-medicine', color: '#10B981' },
  business: { name: 'Business & Finance', slug: 'business-finance', color: '#F59E0B' },
  science: { name: 'Natural Sciences', slug: 'natural-sciences', color: '#14B8A6' },
  education: { name: 'Education & Social Sciences', slug: 'education-social-sciences', color: '#8B5CF6' },
  law: { name: 'Law & Public Policy', slug: 'law-public-policy', color: '#6366F1' },
  arts: { name: 'Arts & Design', slug: 'arts-design', color: '#EC4899' },
  media: { name: 'Communications & Media', slug: 'communications-media', color: '#F97316' },
};

export const questions: CareerQuizQuestion[] = [
  {
    id: 1,
    question: "On a free weekend, which activity sounds most appealing?",
    options: [
      { text: "Building or coding a personal project", scores: { tech: 3 } },
      { text: "Volunteering at a local clinic or care center", scores: { health: 3 } },
      { text: "Analyzing stock trends or planning investments", scores: { business: 3 } },
      { text: "Going on a nature hike and identifying plants/wildlife", scores: { science: 3 } }
    ]
  },
  {
    id: 2,
    question: "Which type of documentary would you most likely watch?",
    options: [
      { text: "The psychology behind human behavior", scores: { education: 3 } },
      { text: "Legal battles that changed history", scores: { law: 3 } },
      { text: "The creative process of famous artists", scores: { arts: 3 } },
      { text: "How viral content shapes public opinion", scores: { media: 3 } }
    ]
  },
  {
    id: 3,
    question: "In a group project, you naturally tend to:",
    options: [
      { text: "Handle the technical aspects and problem-solving", scores: { tech: 2, science: 1 } },
      { text: "Make sure everyone's well-being is considered", scores: { health: 2, education: 1 } },
      { text: "Take charge of planning, budgets, and deadlines", scores: { business: 3 } },
      { text: "Create the visual presentation and design elements", scores: { arts: 2, media: 1 } }
    ]
  },
  {
    id: 4,
    question: "Which headline would grab your attention first?",
    options: [
      { text: "New AI System Revolutionizes Problem-Solving", scores: { tech: 3 } },
      { text: "Breakthrough Treatment Shows Promise for Rare Disease", scores: { health: 3 } },
      { text: "Climate Scientists Discover New Ecosystem Pattern", scores: { science: 3 } },
      { text: "Supreme Court Decision Reshapes Civil Rights", scores: { law: 3 } }
    ]
  },
  {
    id: 5,
    question: "Which headline would grab your attention first?",
    options: [
      { text: "Study Reveals How Childhood Experiences Shape Adult Behavior", scores: { education: 3 } },
      { text: "Startup Disrupts Industry with New Business Model", scores: { business: 3 } },
      { text: "Artist's Unconventional Work Challenges Perceptions", scores: { arts: 3 } },
      { text: "Investigative Report Uncovers Hidden Truth", scores: { media: 3 } }
    ]
  },
  {
    id: 6,
    question: "Which skill would you most like to master?",
    options: [
      { text: "Programming or engineering design", scores: { tech: 3 } },
      { text: "Diagnosing problems and providing care", scores: { health: 3 } },
      { text: "Negotiation and strategic planning", scores: { business: 2, law: 1 } },
      { text: "Scientific research methodology", scores: { science: 3 } }
    ]
  },
  {
    id: 7,
    question: "Which skill would you most like to master?",
    options: [
      { text: "Understanding and teaching complex concepts", scores: { education: 3 } },
      { text: "Persuasive argumentation and debate", scores: { law: 3 } },
      { text: "Visual composition and creative expression", scores: { arts: 3 } },
      { text: "Storytelling and public speaking", scores: { media: 3 } }
    ]
  },
  {
    id: 8,
    question: "What kind of problems do you enjoy solving most?",
    options: [
      { text: "Logical puzzles with clear right/wrong answers", scores: { tech: 2, science: 2 } },
      { text: "Helping people navigate difficult situations", scores: { health: 2, education: 2 } },
      { text: "Finding win-win solutions in conflicts", scores: { business: 2, law: 2 } },
      { text: "Expressing complex ideas in engaging ways", scores: { arts: 2, media: 2 } }
    ]
  },
  {
    id: 9,
    question: "Which work environment appeals to you most?",
    options: [
      { text: "A tech lab or innovation workspace", scores: { tech: 3 } },
      { text: "A hospital, clinic, or research facility", scores: { health: 2, science: 2 } },
      { text: "A corporate office or trading floor", scores: { business: 3 } },
      { text: "A courtroom or government building", scores: { law: 3 } }
    ]
  },
  {
    id: 10,
    question: "Which work environment appeals to you most?",
    options: [
      { text: "A school, university, or community center", scores: { education: 3 } },
      { text: "A design studio or creative agency", scores: { arts: 3 } },
      { text: "A newsroom or production studio", scores: { media: 3 } },
      { text: "A field research station or laboratory", scores: { science: 3 } }
    ]
  },
  {
    id: 11,
    question: "What motivates you most in your work?",
    options: [
      { text: "Creating efficient systems and innovations", scores: { tech: 3 } },
      { text: "Making a direct positive impact on people's lives", scores: { health: 2, education: 2 } },
      { text: "Building wealth and achieving financial success", scores: { business: 3 } },
      { text: "Discovering new knowledge about the world", scores: { science: 3 } }
    ]
  },
  {
    id: 12,
    question: "What motivates you most in your work?",
    options: [
      { text: "Fighting for justice and fairness", scores: { law: 3 } },
      { text: "Expressing creativity and beauty", scores: { arts: 3 } },
      { text: "Informing and connecting with audiences", scores: { media: 3 } },
      { text: "Understanding human behavior and society", scores: { education: 2, law: 1 } }
    ]
  },
  {
    id: 13,
    question: "Which book topic would you pick up first?",
    options: [
      { text: "The future of artificial intelligence", scores: { tech: 3 } },
      { text: "The science of human health and longevity", scores: { health: 3 } },
      { text: "Strategies of successful entrepreneurs", scores: { business: 3 } },
      { text: "Mysteries of the universe and nature", scores: { science: 3 } }
    ]
  },
  {
    id: 14,
    question: "Which book topic would you pick up first?",
    options: [
      { text: "How people learn and develop", scores: { education: 3 } },
      { text: "Famous legal cases that changed society", scores: { law: 3 } },
      { text: "The history of art movements", scores: { arts: 3 } },
      { text: "How media shapes culture and politics", scores: { media: 3 } }
    ]
  },
  {
    id: 15,
    question: "If you could solve one global challenge, which would it be?",
    options: [
      { text: "Advancing technology to solve resource problems", scores: { tech: 2, science: 2 } },
      { text: "Eliminating diseases and improving healthcare access", scores: { health: 3 } },
      { text: "Reducing poverty through economic development", scores: { business: 2, education: 1 } },
      { text: "Reforming systems to ensure justice for all", scores: { law: 2, education: 1 } }
    ]
  },
  {
    id: 16,
    question: "How do you prefer to express yourself?",
    options: [
      { text: "Through data, code, or technical solutions", scores: { tech: 2, science: 2 } },
      { text: "Through caring actions and support", scores: { health: 3 } },
      { text: "Through strategic plans and presentations", scores: { business: 2, media: 1 } },
      { text: "Through visual art, music, or design", scores: { arts: 3 } }
    ]
  },
  {
    id: 17,
    question: "How do you prefer to express yourself?",
    options: [
      { text: "Through teaching and mentoring others", scores: { education: 3 } },
      { text: "Through well-reasoned arguments", scores: { law: 3 } },
      { text: "Through writing and storytelling", scores: { media: 3 } },
      { text: "Through research and analysis", scores: { science: 2, business: 1 } }
    ]
  },
  {
    id: 18,
    question: "What kind of legacy would you like to leave?",
    options: [
      { text: "Inventions or systems that improve daily life", scores: { tech: 3 } },
      { text: "Lives saved or improved through care", scores: { health: 3 } },
      { text: "A successful organization or financial empire", scores: { business: 3 } },
      { text: "Scientific discoveries that advance human knowledge", scores: { science: 3 } }
    ]
  },
  {
    id: 19,
    question: "What kind of legacy would you like to leave?",
    options: [
      { text: "Students or communities you've helped develop", scores: { education: 3 } },
      { text: "Laws or policies that created positive change", scores: { law: 3 } },
      { text: "Art or designs that moved and inspired people", scores: { arts: 3 } },
      { text: "Stories or content that informed and entertained", scores: { media: 3 } }
    ]
  },
  {
    id: 20,
    question: "Which compliment would mean the most to you?",
    options: [
      { text: "\"You're so innovative and technically brilliant\"", scores: { tech: 3 } },
      { text: "\"You have such a caring and healing presence\"", scores: { health: 3 } },
      { text: "\"You have amazing business instincts\"", scores: { business: 3 } },
      { text: "\"Your curiosity and analytical mind are incredible\"", scores: { science: 3 } }
    ]
  },
  {
    id: 21,
    question: "Which compliment would mean the most to you?",
    options: [
      { text: "\"You're such a patient and inspiring teacher\"", scores: { education: 3 } },
      { text: "\"Your sense of justice is unwavering\"", scores: { law: 3 } },
      { text: "\"Your creative vision is truly unique\"", scores: { arts: 3 } },
      { text: "\"You have a gift for connecting with audiences\"", scores: { media: 3 } }
    ]
  }
];
