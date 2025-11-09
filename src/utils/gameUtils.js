// Fisher-Yates shuffle algorithm
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get category display name in both languages
export const getCategoryDisplay = (category) => {
  const categoryMap = {
    getting_to_know: { en: 'Getting to Know Me', zh: '很想了解你' },
    ideals_reals: { en: 'Ideals and Reals', zh: '理想与现实' },
    heart_to_heart: { en: 'Heart to Heart', zh: '再靠近一点点' },
    memories: { en: 'Memories', zh: '回忆杀' },
    matters_of_soul: { en: 'Matters of the Soul', zh: '想多一点点' }
  };
  return categoryMap[category] || { en: category, zh: category };
};

// Get category code for masked display
export const getCategoryCode = (category) => {
  const codeMap = {
    getting_to_know: '了解你',
    ideals_reals: '理想现实',
    heart_to_heart: '靠近',
    memories: '回忆',
    matters_of_soul: '灵魂'
  };
  return codeMap[category] || category;
};

// Format question ID for display
export const formatQuestionId = (id, category) => {
  const code = getCategoryCode(category);
  const number = id.replace(/[a-z]/gi, '');
  return `[${code}][${number.padStart(3, '0')}]`;
};

// Load all questions from JSON
export const loadAllQuestions = (questionsData) => {
  const allQuestions = [];
  Object.keys(questionsData).forEach(category => {
    questionsData[category].forEach(question => {
      allQuestions.push({
        ...question,
        category
      });
    });
  });
  return allQuestions;
};

// Group questions by category
export const groupByCategory = (questions) => {
  const grouped = {
    getting_to_know: [],
    ideals_reals: [],
    heart_to_heart: [],
    memories: [],
    matters_of_soul: []
  };
  
  questions.forEach(question => {
    if (grouped[question.category]) {
      grouped[question.category].push(question);
    }
  });
  
  return grouped;
};

// Check if all cards have been used
export const areAllCardsUsed = (activeDeck) => {
  return activeDeck.length === 0;
};

// Get a random card from active deck
export const drawRandomCard = (activeDeck) => {
  if (activeDeck.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * activeDeck.length);
  return activeDeck[randomIndex];
};
