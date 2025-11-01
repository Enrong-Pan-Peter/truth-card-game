import React, { useState } from 'react';
import Card from './Card';
import { getCategoryDisplay, formatQuestionId } from '../utils/gameUtils';

const CategoryDropdown = ({ category, questions, onQuestionSelect, usedCardIds }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const categoryDisplay = getCategoryDisplay(category);

  return (
    <div className="border-2 border-warm-brown-light/20 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
      {/* Category Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-warm-peach/20 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{isExpanded ? '▼' : '▶'}</span>
          <div className="text-left">
            <h3 className="text-xl font-display text-warm-brown-dark">
              {categoryDisplay.en}
            </h3>
            <p className="text-sm text-warm-brown/70">{categoryDisplay.zh}</p>
          </div>
        </div>
        <span className="text-sm text-warm-brown/60">
          {questions.length} questions
        </span>
      </button>

      {/* Questions List */}
      {isExpanded && (
        <div className="px-6 py-4 space-y-2 bg-warm-cream/30 max-h-96 overflow-y-auto">
          {questions.map((question) => {
            const isUsed = usedCardIds.includes(question.id);
            return (
              <button
                key={question.id}
                onClick={() => onQuestionSelect(question)}
                disabled={isUsed}
                className={`
                  w-full px-4 py-3 rounded-xl text-left transition-all duration-200
                  ${isUsed
                    ? 'bg-warm-brown-light/10 text-warm-brown/40 cursor-not-allowed'
                    : 'bg-white hover:bg-warm-peach/30 text-warm-brown-dark hover:shadow-md'
                  }
                `}
              >
                <span className="font-display">
                  {formatQuestionId(question.id, category)}
                </span>
                {isUsed && (
                  <span className="ml-2 text-xs">(Used)</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ChooseMode = ({ questionsByCategory, onCardSelected, usedCardIds }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleQuestionSelect = (question) => {
    setSelectedCard(question);
    onCardSelected(question);
  };

  const handleCloseCard = () => {
    setSelectedCard(null);
  };

  return (
    <div className="space-y-6">
      {!selectedCard ? (
        <>
          {/* Instructions */}
          <div className="text-center mb-8 space-y-2">
            <p className="text-warm-brown-dark font-display text-lg">
              Choose a category and select a question
            </p>
            <p className="text-warm-brown/70 text-sm">
              选择类别并挑选问题
            </p>
          </div>

          {/* Category Dropdowns */}
          <div className="space-y-4 max-w-3xl mx-auto">
            {Object.keys(questionsByCategory).map((category) => (
              <CategoryDropdown
                key={category}
                category={category}
                questions={questionsByCategory[category]}
                onQuestionSelect={handleQuestionSelect}
                usedCardIds={usedCardIds}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="min-h-[400px] flex items-center justify-center">
          <Card question={selectedCard} onClose={handleCloseCard} />
        </div>
      )}
    </div>
  );
};

export default ChooseMode;
