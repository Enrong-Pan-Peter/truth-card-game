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
    childhood: { en: 'Childhood', zh: '童年' },
    school_work: { en: 'School & Work', zh: '学业 & 工作' },
    belief: { en: 'Belief', zh: '信仰' },
    relationship: { en: 'Relationship', zh: '关系' }
  };
  return categoryMap[category] || { en: category, zh: category };
};

// Get category code for masked display
export const getCategoryCode = (category) => {
  const codeMap = {
    childhood: '童年',
    school_work: '学业工作',
    belief: '信仰',
    relationship: '关系'
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
    childhood: [],
    school_work: [],
    belief: [],
    relationship: []
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
