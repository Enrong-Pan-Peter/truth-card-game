import React, { useState, useEffect } from 'react';
import ShuffleMode from './components/ShuffleMode';
import ChooseMode from './components/ChooseMode';
import UsedCardsSidebar from './components/UsedCardsSidebar';
import CustomQuestionForm from './components/CustomQuestionForm';
import questionsData from './data/questions.json';
import { loadAllQuestions, groupByCategory } from './utils/gameUtils';

function App() {
  const [mode, setMode] = useState('shuffle'); // 'shuffle' or 'choose'
  const [allQuestions, setAllQuestions] = useState([]);
  const [activeDeck, setActiveDeck] = useState([]);
  const [usedCards, setUsedCards] = useState([]);
  const [isCustomFormOpen, setIsCustomFormOpen] = useState(false);
  const [customIdCounter, setCustomIdCounter] = useState(1);

  // Initialize questions on mount
  useEffect(() => {
    const questions = loadAllQuestions(questionsData);
    setAllQuestions(questions);
    setActiveDeck(questions);
  }, []);

  // Handle card drawn in shuffle mode
  const handleCardDrawn = (card) => {
    setActiveDeck(prev => prev.filter(q => q.id !== card.id));
    setUsedCards(prev => [...prev, card]);
  };

  // Handle card selected in choose mode
  const handleCardSelected = (card) => {
    setActiveDeck(prev => prev.filter(q => q.id !== card.id));
    setUsedCards(prev => [...prev, card]);
  };

  // Handle returning card to active deck
  const handleReturnCard = (card) => {
    setUsedCards(prev => prev.filter(q => q.id !== card.id));
    setActiveDeck(prev => [...prev, card]);
  };

  // Reset deck
  const handleResetDeck = () => {
    setActiveDeck(allQuestions);
    setUsedCards([]);
  };

  // Add custom question
  const handleAddCustomQuestion = (formData) => {
    const newQuestion = {
      id: `custom${customIdCounter}`,
      en: formData.en,
      zh: formData.zh,
      category: formData.category,
      isCustom: true
    };

    setAllQuestions(prev => [...prev, newQuestion]);
    setActiveDeck(prev => [...prev, newQuestion]);
    setCustomIdCounter(prev => prev + 1);
  };

  const questionsByCategory = groupByCategory(activeDeck);
  const usedCardIds = usedCards.map(card => card.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-cream via-warm-sand to-warm-peach/30">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-sm border-b-2 border-warm-brown-light/20 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Title */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-display text-warm-brown-dark">
                Truth Cards
              </h1>
              <p className="text-sm text-warm-brown/70 mt-1">
                真心话卡牌
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Mode Toggle */}
              <div className="flex bg-warm-brown-light/10 rounded-full p-1">
                <button
                  onClick={() => setMode('shuffle')}
                  className={`
                    px-6 py-2 rounded-full font-display text-sm transition-all duration-300
                    ${mode === 'shuffle'
                      ? 'bg-warm-coral text-white shadow-md'
                      : 'text-warm-brown-dark hover:bg-warm-brown-light/10'
                    }
                  `}
                >
                  Shuffle / 抽卡
                </button>
                <button
                  onClick={() => setMode('choose')}
                  className={`
                    px-6 py-2 rounded-full font-display text-sm transition-all duration-300
                    ${mode === 'choose'
                      ? 'bg-warm-coral text-white shadow-md'
                      : 'text-warm-brown-dark hover:bg-warm-brown-light/10'
                    }
                  `}
                >
                  Choose / 选择
                </button>
              </div>

              {/* Add Question Button */}
              <button
                onClick={() => setIsCustomFormOpen(true)}
                className="p-3 bg-warm-peach rounded-full hover:bg-warm-peach/80 transition-colors duration-200 shadow-md"
                title="Add custom question"
              >
                <svg className="w-5 h-5 text-warm-brown-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {mode === 'shuffle' ? (
          <ShuffleMode
            activeDeck={activeDeck}
            onCardDrawn={handleCardDrawn}
            onReset={handleResetDeck}
          />
        ) : (
          <ChooseMode
            questionsByCategory={questionsByCategory}
            onCardSelected={handleCardSelected}
            usedCardIds={usedCardIds}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-warm-brown/50 text-sm">
        <p>Made with ❤️ for meaningful conversations</p>
        <p className="mt-1 text-xs">为有意义的对话而制作</p>
      </footer>

      {/* Used Cards Sidebar */}
      <UsedCardsSidebar
        usedCards={usedCards}
        onReturnCard={handleReturnCard}
      />

      {/* Custom Question Form Modal */}
      <CustomQuestionForm
        isOpen={isCustomFormOpen}
        onClose={() => setIsCustomFormOpen(false)}
        onAddQuestion={handleAddCustomQuestion}
      />
    </div>
  );
}

export default App;
