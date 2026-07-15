import React, { useEffect, useMemo, useState } from 'react';
import questionsData from './data/questions.json';
import {
  CARD_IMAGES,
  CATEGORIES,
  drawRandomCard,
  groupByCategory,
  loadAllQuestions,
} from './utils/gameUtils';
import { loadState, saveState } from './utils/storage';
import { Bi, LanguageProvider, pick } from './i18n';
import ShuffleMode from './components/ShuffleMode';
import ChooseMode from './components/ChooseMode';
import Sheet from './components/Sheet';
import BottomBar from './components/BottomBar';
import FilterPanel from './components/FilterPanel';
import UsedPanel from './components/UsedPanel';
import CustomQuestionForm from './components/CustomQuestionForm';
import { FilterIcon, PlusIcon, UsedIcon } from './components/Icons';

const saved = loadState() || {};
const defaultCategories = Object.fromEntries(CATEGORIES.map((c) => [c, true]));

const LangToggle = ({ lang, onChange }) => (
  <div className="flex rounded-full bg-ivory p-0.5 border-2 border-pale-pink/30 shrink-0">
    {[
      ['en', 'EN'],
      ['zh', '中文'],
      ['both', '双语'],
    ].map(([value, label]) => (
      <button
        key={value}
        onClick={() => onChange(value)}
        className={`px-2.5 h-9 rounded-full text-xs transition-colors ${
          lang === value ? 'bg-blue-primary text-white' : 'text-gray-secondary'
        }`}
        aria-pressed={lang === value}
      >
        {label}
      </button>
    ))}
  </div>
);

const HeaderIconButton = ({ onClick, label, badge, orange, children }) => (
  <button
    onClick={onClick}
    title={label}
    aria-label={label}
    className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
      orange
        ? 'bg-orange-primary text-white shadow-btn-orange'
        : 'bg-ivory border-2 border-pale-pink/30 text-gray-secondary hover:text-ink'
    }`}
  >
    {children}
    {badge != null && (
      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-orange-primary text-white text-[10px] leading-[18px] text-center">
        {badge}
      </span>
    )}
  </button>
);

function App() {
  // --- persisted state (auto-restored on load) ---
  const [lang, setLang] = useState(saved.lang || 'both');
  const [mode, setMode] = useState(saved.mode || 'shuffle');
  const [customQuestions, setCustomQuestions] = useState(saved.customQuestions || []);
  const [customIdCounter, setCustomIdCounter] = useState(saved.customIdCounter || 1);
  const [usedIds, setUsedIds] = useState(saved.usedIds || []);
  const [selectedCategories, setSelectedCategories] = useState({
    ...defaultCategories,
    ...(saved.selectedCategories || {}),
  });
  const [allowRepeat, setAllowRepeat] = useState(saved.allowRepeat || false);
  const [currentCardId, setCurrentCardId] = useState(saved.currentCardId || null);
  const [imageIndex, setImageIndex] = useState(
    saved.imageIndex ?? Math.floor(Math.random() * CARD_IMAGES.length)
  );

  // --- transient state ---
  const [openSheet, setOpenSheet] = useState(null); // 'filter' | 'used' | 'add' | null
  const [isDrawing, setIsDrawing] = useState(false);

  // --- derived ---
  const allQuestions = useMemo(
    () => [...loadAllQuestions(questionsData), ...customQuestions],
    [customQuestions]
  );
  const usedSet = useMemo(() => new Set(usedIds), [usedIds]);
  const activeDeck = useMemo(
    () => allQuestions.filter((q) => !usedSet.has(q.id)),
    [allQuestions, usedSet]
  );
  const filteredDeck = useMemo(
    () => activeDeck.filter((q) => selectedCategories[q.category]),
    [activeDeck, selectedCategories]
  );
  const totalInSelected = useMemo(
    () => allQuestions.filter((q) => selectedCategories[q.category]).length,
    [allQuestions, selectedCategories]
  );
  const usedCards = useMemo(() => {
    const byId = new Map(allQuestions.map((q) => [q.id, q]));
    return usedIds.map((id) => byId.get(id)).filter(Boolean);
  }, [allQuestions, usedIds]);
  const currentCard = useMemo(
    () => allQuestions.find((q) => q.id === currentCardId) || null,
    [allQuestions, currentCardId]
  );
  const remaining = useMemo(() => {
    const grouped = groupByCategory(activeDeck);
    return Object.fromEntries(CATEGORIES.map((c) => [c, grouped[c].length]));
  }, [activeDeck]);
  const selectedCount = CATEGORIES.filter((c) => selectedCategories[c]).length;
  const canDraw = (allowRepeat ? totalInSelected : filteredDeck.length) > 0;
  const questionsByCategory = useMemo(() => groupByCategory(allQuestions), [allQuestions]);
  const currentImage = CARD_IMAGES[imageIndex % CARD_IMAGES.length];

  // --- persistence: save everything on every change ---
  useEffect(() => {
    saveState({
      lang,
      mode,
      customQuestions,
      customIdCounter,
      usedIds,
      selectedCategories,
      allowRepeat,
      currentCardId,
      imageIndex,
    });
  }, [
    lang,
    mode,
    customQuestions,
    customIdCounter,
    usedIds,
    selectedCategories,
    allowRepeat,
    currentCardId,
    imageIndex,
  ]);

  // --- actions ---
  const handleDraw = () => {
    if (isDrawing || !canDraw) return;
    setIsDrawing(true);
    setTimeout(() => {
      const pool = allowRepeat
        ? allQuestions.filter((q) => selectedCategories[q.category] && q.id !== currentCardId)
        : filteredDeck;
      const source = pool.length
        ? pool
        : allQuestions.filter((q) => selectedCategories[q.category]);
      const card = drawRandomCard(source);
      if (card) {
        setCurrentCardId(card.id);
        if (!allowRepeat) setUsedIds((prev) => [...prev, card.id]);
        setImageIndex(Math.floor(Math.random() * CARD_IMAGES.length));
      }
      setIsDrawing(false);
    }, 280);
  };

  const handleChooseCard = (question) => {
    setCurrentCardId(question.id);
    if (!usedSet.has(question.id)) setUsedIds((prev) => [...prev, question.id]);
    setImageIndex(Math.floor(Math.random() * CARD_IMAGES.length));
  };

  const handleReturnCard = (id) => setUsedIds((prev) => prev.filter((x) => x !== id));

  const resetDeck = () => {
    setUsedIds([]);
    setCurrentCardId(null);
  };

  const confirmResetDeck = () => {
    if (
      window.confirm(
        pick(lang, 'Reset the deck? Used cards will be cleared.', '重置卡组？已用记录将被清空。')
      )
    ) {
      resetDeck();
      setOpenSheet(null);
    }
  };

  const handleAddCustomQuestion = ({ en, zh, category }) => {
    const question = { id: `custom${customIdCounter}`, en, zh, category, isCustom: true };
    setCustomQuestions((prev) => [...prev, question]);
    setCustomIdCounter((c) => c + 1);
  };

  const closeSheet = () => setOpenSheet(null);

  return (
    <LanguageProvider lang={lang}>
      <div className="min-h-dvh bg-ivory flex flex-col">
        {/* Header: compact on mobile, full controls on desktop */}
        <header className="bg-white/95 backdrop-blur border-b-2 border-pale-pink/30 md:sticky md:top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-2 min-w-0">
              <h1 className="font-hand text-2xl md:text-3xl text-ink whitespace-nowrap">
                Truth Cards
              </h1>
              <span className="font-zh text-sm text-gray-secondary hidden sm:inline">
                真心话卡牌
              </span>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden md:flex items-center gap-3">
                <div className="flex rounded-full bg-ivory p-1 border-2 border-pale-pink/20">
                  {['shuffle', 'choose'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`px-5 h-10 rounded-full text-sm transition-all ${
                        mode === m ? 'bg-blue-primary text-white shadow-btn' : 'text-ink'
                      }`}
                      aria-pressed={mode === m}
                    >
                      {m === 'shuffle' ? <Bi en="Shuffle" zh="抽卡" /> : <Bi en="Choose" zh="选择" />}
                    </button>
                  ))}
                </div>
                <HeaderIconButton
                  onClick={() => setOpenSheet('filter')}
                  label={pick(lang, 'Filter categories', '筛选类别')}
                  badge={selectedCount < CATEGORIES.length ? selectedCount : null}
                >
                  <FilterIcon className="w-5 h-5" />
                </HeaderIconButton>
                <HeaderIconButton
                  onClick={() => setOpenSheet('used')}
                  label={pick(lang, 'Used cards', '已用卡牌')}
                  badge={usedIds.length > 0 ? usedIds.length : null}
                >
                  <UsedIcon className="w-5 h-5" />
                </HeaderIconButton>
                <HeaderIconButton
                  onClick={() => setOpenSheet('add')}
                  label={pick(lang, 'Add a question', '添加问题')}
                  orange
                >
                  <PlusIcon className="w-5 h-5" strokeWidth={2.2} />
                </HeaderIconButton>
              </div>
              <LangToggle lang={lang} onChange={setLang} />
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-4 md:py-8">
          {mode === 'shuffle' ? (
            <ShuffleMode
              currentCard={currentCard}
              image={currentImage}
              isDrawing={isDrawing}
              canDraw={canDraw}
              filteredCount={filteredDeck.length}
              totalInSelected={totalInSelected}
              allowRepeat={allowRepeat}
              onDraw={handleDraw}
              onReset={resetDeck}
              onOpenFilter={() => setOpenSheet('filter')}
            />
          ) : (
            <ChooseMode
              questionsByCategory={questionsByCategory}
              onCardSelected={handleChooseCard}
              usedIds={usedIds}
              image={currentImage}
            />
          )}
        </main>

        <footer className="text-center px-4 pt-4 pb-24 md:pb-8 text-sm text-gray-secondary space-y-2">
          <p>
            <Bi en="Made with ♥ for meaningful conversations" zh="为有意义的对话而制作" />
          </p>
          <p className="text-xs">
            <Bi en="Lovely illustrations by Baichen (Peter) Lin" zh="插画设计：林百宸" />
          </p>
          <p className="text-xs font-zh">如果有任何建议，拜托联系微信：December7-P，谢谢！</p>
        </footer>

        <BottomBar
          mode={mode}
          onModeChange={setMode}
          onOpenSheet={setOpenSheet}
          usedCount={usedIds.length}
          filterCount={selectedCount}
          totalCategories={CATEGORIES.length}
        />

        <Sheet
          open={openSheet === 'filter'}
          onClose={closeSheet}
          titleEn="Filter Categories"
          titleZh="筛选类别"
        >
          <FilterPanel
            selectedCategories={selectedCategories}
            onToggleCategory={(cat) =>
              setSelectedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }))
            }
            onSelectAll={() => setSelectedCategories(defaultCategories)}
            remaining={remaining}
            allowRepeat={allowRepeat}
            onToggleRepeat={() => setAllowRepeat((v) => !v)}
          />
        </Sheet>

        <Sheet
          open={openSheet === 'used'}
          onClose={closeSheet}
          titleEn="Used Cards"
          titleZh="已用卡牌"
          footer={
            usedIds.length > 0 ? (
              <button
                onClick={confirmResetDeck}
                className="w-full py-3 min-h-[48px] rounded-full bg-orange-primary text-white shadow-btn-orange active:scale-95 transition-transform"
              >
                <Bi en="Reset Deck" zh="重置卡组" />
              </button>
            ) : null
          }
        >
          <UsedPanel usedCards={usedCards} onReturnCard={handleReturnCard} />
        </Sheet>

        <Sheet
          open={openSheet === 'add'}
          onClose={closeSheet}
          titleEn="Add a Question"
          titleZh="添加问题"
        >
          <CustomQuestionForm onAdd={handleAddCustomQuestion} onClose={closeSheet} />
        </Sheet>
      </div>
    </LanguageProvider>
  );
}

export default App;
