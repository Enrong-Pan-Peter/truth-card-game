// Category order used across the app ('spicy' is opt-in, off by default)
export const CATEGORIES = [
  'getting_to_know',
  'ideals_reals',
  'heart_to_heart',
  'memories',
  'matters_of_soul',
  'spicy',
];

// Dare deck intensity levels
export const DARE_LEVELS = ['mild', 'medium', 'bold'];

export const getDareLevelDisplay = (level) => {
  const map = {
    mild: { en: 'Easy', zh: '轻松' },
    medium: { en: 'Medium', zh: '适中' },
    bold: { en: 'Bold', zh: '大胆' },
  };
  return map[level] || { en: level, zh: level };
};

// Artwork paths (respect the deploy base path)
export const CARD_IMAGES = [1, 2, 3, 4, 5].map(
  (n) => `${import.meta.env.BASE_URL}images/card-image-${n}.png`
);

// Category display name in both languages
export const getCategoryDisplay = (category) => {
  const categoryMap = {
    getting_to_know: { en: 'Getting to Know Me', zh: '很想了解你' },
    ideals_reals: { en: 'Ideals and Reals', zh: '理想与现实' },
    heart_to_heart: { en: 'Heart to Heart', zh: '再靠近一点点' },
    memories: { en: 'Memories', zh: '回忆杀' },
    matters_of_soul: { en: 'Matters of the Soul', zh: '想多一点点' },
    spicy: { en: 'Spicy', zh: '劲爆' },
    dare: { en: 'Dare', zh: '大冒险' },
  };
  return categoryMap[category] || { en: category, zh: category };
};

// Short category code for masked question IDs
export const getCategoryCode = (category) => {
  const codeMap = {
    getting_to_know: '了解你',
    ideals_reals: '理想现实',
    heart_to_heart: '靠近',
    memories: '回忆',
    matters_of_soul: '灵魂',
    spicy: '劲爆',
    dare: '冒险',
  };
  return codeMap[category] || category;
};

// Attach isDare/category to raw dares.json rows
export const loadAllDares = (daresData) =>
  daresData.map((d) => ({ ...d, category: 'dare', isDare: true }));

// Masked display, e.g. [靠近][042]
export const formatQuestionId = (id, category) => {
  const code = getCategoryCode(category);
  const number = id.replace(/[a-z]/gi, '');
  return `[${code}][${number.padStart(3, '0')}]`;
};

// Flatten questions.json into a single array with category attached
export const loadAllQuestions = (questionsData) => {
  const allQuestions = [];
  Object.keys(questionsData).forEach((category) => {
    questionsData[category].forEach((question) => {
      allQuestions.push({ ...question, category });
    });
  });
  return allQuestions;
};

// Group an array of questions by category (keeps CATEGORIES order)
export const groupByCategory = (questions) => {
  const grouped = Object.fromEntries(CATEGORIES.map((c) => [c, []]));
  questions.forEach((q) => {
    if (grouped[q.category]) grouped[q.category].push(q);
  });
  return grouped;
};

// Random card from a deck
export const drawRandomCard = (deck) => {
  if (deck.length === 0) return null;
  return deck[Math.floor(Math.random() * deck.length)];
};
