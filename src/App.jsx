import React, { useState, useEffect } from 'react';
import ShuffleMode from './components/ShuffleMode';
import ChooseMode from './components/ChooseMode';
import UsedCardsSidebar from './components/UsedCardsSidebar';
import CustomQuestionForm from './components/CustomQuestionForm';
import questionsData from './data/questions.json';
import { loadAllQuestions, groupByCategory } from './utils/gameUtils';

function App() {
  const [mode, setMode] = useState('shuffle');
  const [allQuestions, setAllQuestions] = useState([]);
  const [activeDeck, setActiveDeck] = useState([]);
  const [usedCards, setUsedCards] = useState([]);
  const [isCustomFormOpen, setIsCustomFormOpen] = useState(false);
  const [customIdCounter, setCustomIdCounter] = useState(1);
  
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Put your 10 images in /public/images/ folder
  const cardImages = [
    '/images/card-image-1.png',
    '/images/card-image-2.png',
    '/images/card-image-3.png',
    '/images/card-image-4.png',
    '/images/card-image-5.png',
    // '/images/card-image-6.png',
    // '/images/card-image-7.png',
    // '/images/card-image-8.png',
    // '/images/card-image-9.png',
    // '/images/card-image-10.png',
  ];

  useEffect(() => {
    const questions = loadAllQuestions(questionsData);
    setAllQuestions(questions);
    setActiveDeck(questions);
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (window.innerWidth <= 768) {
        if (currentScrollY < lastScrollY || currentScrollY < 50) {
          setHeaderVisible(true);
        } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setHeaderVisible(false);
        }
      } else {
        setHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * cardImages.length);
    setCurrentImageIndex(randomIndex);
    return cardImages[randomIndex];
  };

  const handleCardDrawn = (card) => {
    setActiveDeck(prev => prev.filter(q => q.id !== card.id));
    setUsedCards(prev => [...prev, card]);
    getRandomImage();
  };

  const handleCardSelected = (card) => {
    setActiveDeck(prev => prev.filter(q => q.id !== card.id));
    setUsedCards(prev => [...prev, card]);
    getRandomImage();
  };

  const handleReturnCard = (card) => {
    setUsedCards(prev => prev.filter(q => q.id !== card.id));
    setActiveDeck(prev => [...prev, card]);
  };

  const handleResetDeck = () => {
    setActiveDeck(allQuestions);
    setUsedCards([]);
  };

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
    <div className="min-h-screen" style={{ background: '#FFF8EB' }}>
      <header 
        className={`sticky top-0 z-20 transition-transform duration-300 ${!headerVisible ? '-translate-y-full' : 'translate-y-0'}`}
        style={{ 
          background: '#FFFFFF',
          borderBottom: '2px solid rgba(208, 183, 176, 0.3)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h1 
                className="text-3xl md:text-4xl"
                style={{ 
                  fontFamily: "'Patrick Hand', cursive",
                  color: '#282828'
                }}
              >
                Truth Cards
              </h1>
              <p 
                className="text-sm mt-1"
                style={{ 
                  color: '#656565',
                  fontFamily: "'Ma Shan Zheng', 'Crimson Text', serif"
                }}
              >
                真心话卡牌
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div 
                className="flex rounded-full p-1"
                style={{ background: '#FFF8EB' }}
              >
                <button
                  onClick={() => setMode('shuffle')}
                  className="px-6 py-2 rounded-full text-sm transition-all duration-300"
                  style={{
                    fontFamily: "'Patrick Hand', cursive",
                    background: mode === 'shuffle' ? '#4D7491' : 'transparent',
                    color: mode === 'shuffle' ? '#FFFFFF' : '#282828',
                    boxShadow: mode === 'shuffle' ? '0 4px 12px rgba(77,116,145,0.3)' : 'none'
                  }}
                >
                  <span style={{ fontFamily: "'Patrick Hand', cursive" }}>Shuffle</span>
                  {' / '}
                  <span style={{ fontFamily: "'Ma Shan Zheng', 'Crimson Text', serif" }}>抽卡</span>
                </button>
                <button
                  onClick={() => setMode('choose')}
                  className="px-6 py-2 rounded-full text-sm transition-all duration-300"
                  style={{
                    fontFamily: "'Patrick Hand', cursive",
                    background: mode === 'choose' ? '#4D7491' : 'transparent',
                    color: mode === 'choose' ? '#FFFFFF' : '#282828',
                    boxShadow: mode === 'choose' ? '0 4px 12px rgba(77,116,145,0.3)' : 'none'
                  }}
                >
                  <span style={{ fontFamily: "'Patrick Hand', cursive" }}>Choose</span>
                  {' / '}
                  <span style={{ fontFamily: "'Ma Shan Zheng', 'Crimson Text', serif" }}>选择</span>
                </button>
              </div>

              <button
                onClick={() => setIsCustomFormOpen(true)}
                className="p-3 rounded-full transition-colors duration-200"
                style={{
                  background: '#ECB68C',
                  boxShadow: '0 2px 8px rgba(236,182,140,0.3)'
                }}
                title="Add custom question"
              >
                <svg 
                  className="w-5 h-5" 
                  style={{ color: '#FFFFFF' }} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {mode === 'shuffle' ? (
          <ShuffleMode
            activeDeck={activeDeck}
            onCardDrawn={handleCardDrawn}
            onReset={handleResetDeck}
            currentImageIndex={currentImageIndex}
            cardImages={cardImages}
          />
        ) : (
          <ChooseMode
            questionsByCategory={questionsByCategory}
            onCardSelected={handleCardSelected}
            usedCardIds={usedCardIds}
            currentImageIndex={currentImageIndex}
            cardImages={cardImages}
          />
        )}
      </main>

      <footer className="text-center py-8 text-sm space-y-3" style={{ color: '#656565' }}>
      <p style={{ fontFamily: "'Patrick Hand', cursive" }}>
        Made with ❤️ for meaningful conversations
        <span style={{ margin: '0 8px' }}>|</span>
        <span style={{ fontFamily: "'Ma Shan Zheng', 'Crimson Text', serif" }}>为有意义的对话而制作</span>
      </p>
      
      <p className="text-xs mt-4" style={{ fontFamily: "'Patrick Hand', cursive", color: '#656565' }}>
        © Lovely illustrations by talented artist Baichen (Peter) Lin
        <span style={{ margin: '0 8px' }}>|</span>
        <span style={{ fontFamily: "'Ma Shan Zheng', 'Crimson Text', serif" }}>插画设计：林百宸</span>
      </p>
      
      <p className="text-xs mt-3" style={{ fontFamily: "'Ma Shan Zheng', 'Crimson Text', serif", color: '#656565' }}>
        如果有任何建议，拜托联系微信：December7-P，这会对体验很有帮助，谢谢！！
      </p>
    </footer>

      <UsedCardsSidebar
        usedCards={usedCards}
        onReturnCard={handleReturnCard}
      />

      <CustomQuestionForm
        isOpen={isCustomFormOpen}
        onClose={() => setIsCustomFormOpen(false)}
        onAddQuestion={handleAddCustomQuestion}
      />
    </div>
  );
}

export default App;
