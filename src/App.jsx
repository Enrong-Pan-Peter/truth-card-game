import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CARD_IMAGES,
  CATEGORIES,
  drawRandomCard,
  getCategoryDisplay,
  groupByCategory,
} from './utils/gameUtils';
import { loadState, saveState } from './utils/storage';
import { shareCardImage } from './utils/shareCard';
import { Bi, LanguageProvider, pick } from './i18n';
import { supabase } from './lib/supabase';
import { useCloudQuestions } from './hooks/useCloudQuestions';
import { useRoom } from './hooks/useRoom';
import ShuffleMode from './components/ShuffleMode';
import ChooseMode from './components/ChooseMode';
import Sheet from './components/Sheet';
import BottomBar from './components/BottomBar';
import FilterPanel from './components/FilterPanel';
import UsedPanel from './components/UsedPanel';
import CustomQuestionForm from './components/CustomQuestionForm';
import RoomPanel from './components/RoomPanel';
import { FilterIcon, PlusIcon, UsedIcon, UsersIcon } from './components/Icons';

const saved = loadState() || {};
const defaultCategories = Object.fromEntries(CATEGORIES.map((c) => [c, true]));
const defaultTurns = { enabled: false, current: null };
const newQuestionId = () =>
  `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

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
  // --- persisted personal state (auto-restored on load) ---
  const [lang, setLang] = useState(saved.lang || 'both');
  const [mode, setMode] = useState(saved.mode || 'shuffle');
  const [playerName, setPlayerName] = useState(saved.playerName || '');
  const [customQuestions, setCustomQuestions] = useState(saved.customQuestions || []);
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
  const [openSheet, setOpenSheet] = useState(null); // 'filter' | 'used' | 'add' | 'room' | 'share' | null
  const [isDrawing, setIsDrawing] = useState(false);
  const [roomCustoms, setRoomCustoms] = useState([]); // room-scoped custom questions
  const [roomMeta, setRoomMeta] = useState({ hostId: null, drawnBy: null, turns: defaultTurns });
  const [shareImage, setShareImage] = useState(null);

  // --- cloud question bank (falls back to cache, then bundled JSON) ---
  const baseQuestions = useCloudQuestions();

  // --- live room ---
  const applyRemoteState = useCallback((st) => {
    if (Array.isArray(st.usedIds)) setUsedIds(st.usedIds);
    setCurrentCardId(st.currentCardId ?? null);
    if (typeof st.imageIndex === 'number') setImageIndex(st.imageIndex);
    if (st.selectedCategories)
      setSelectedCategories({ ...defaultCategories, ...st.selectedCategories });
    if (typeof st.allowRepeat === 'boolean') setAllowRepeat(st.allowRepeat);
    if (Array.isArray(st.customQuestions)) setRoomCustoms(st.customQuestions);
    setRoomMeta({
      hostId: st.hostId ?? null,
      drawnBy: st.drawnBy ?? null,
      turns: st.turns && typeof st.turns === 'object' ? st.turns : defaultTurns,
    });
  }, []);
  const room = useRoom({ onRemoteState: applyRemoteState });

  // Join from ?room=CODE link (QR) or silently rejoin the last room
  const bootRef = useRef(false);
  useEffect(() => {
    if (bootRef.current || !supabase) return;
    bootRef.current = true;
    const urlRoom = new URLSearchParams(window.location.search).get('room');
    const name = saved.playerName || 'Guest';
    if (urlRoom) {
      window.history.replaceState(null, '', window.location.pathname + window.location.hash);
      room.joinRoom(urlRoom, { name }).then((res) => {
        if (!res.error) setOpenSheet('room');
      });
    } else if (saved.roomCode) {
      room.joinRoom(saved.roomCode, { silent: true, name });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- derived ---
  const activeCustoms = room.active ? roomCustoms : customQuestions;
  const allQuestions = useMemo(
    () => [...baseQuestions, ...activeCustoms],
    [baseQuestions, activeCustoms]
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

  // --- turns ---
  const turnsEnabled = room.active && roomMeta.turns.enabled;
  const myTurn = !turnsEnabled || roomMeta.turns.current === room.myId;
  const currentTurnName = turnsEnabled
    ? room.members.find((m) => m.id === roomMeta.turns.current)?.name || '…'
    : null;
  const isHost = room.active && roomMeta.hostId === room.myId;
  const nextTurnId = (fromId) => {
    const ids = room.members.map((m) => m.id);
    if (!ids.length) return null;
    const i = ids.indexOf(fromId);
    return ids[(i + 1) % ids.length];
  };

  // --- persistence ---
  // In a room the server owns gameplay state; only personal prefs are saved,
  // and the personal snapshot from before joining stays untouched for later.
  useEffect(() => {
    if (room.active) {
      saveState({ ...(loadState() || {}), lang, mode, playerName, roomCode: room.code });
    } else {
      saveState({
        lang,
        mode,
        playerName,
        roomCode: null,
        customQuestions,
        usedIds,
        selectedCategories,
        allowRepeat,
        currentCardId,
        imageIndex,
      });
    }
  }, [
    lang,
    mode,
    playerName,
    room.active,
    room.code,
    customQuestions,
    usedIds,
    selectedCategories,
    allowRepeat,
    currentCardId,
    imageIndex,
  ]);

  // --- single state writer: applies locally and syncs to the room ---
  const commit = (updates) => {
    if ('usedIds' in updates) setUsedIds(updates.usedIds);
    if ('currentCardId' in updates) setCurrentCardId(updates.currentCardId);
    if ('imageIndex' in updates) setImageIndex(updates.imageIndex);
    if ('selectedCategories' in updates) setSelectedCategories(updates.selectedCategories);
    if ('allowRepeat' in updates) setAllowRepeat(updates.allowRepeat);
    if ('customQuestions' in updates) {
      if (room.active) setRoomCustoms(updates.customQuestions);
      else setCustomQuestions(updates.customQuestions);
    }
    if ('hostId' in updates || 'drawnBy' in updates || 'turns' in updates) {
      setRoomMeta((prev) => ({
        hostId: 'hostId' in updates ? updates.hostId : prev.hostId,
        drawnBy: 'drawnBy' in updates ? updates.drawnBy : prev.drawnBy,
        turns: 'turns' in updates ? updates.turns : prev.turns,
      }));
    }
    if (room.active) {
      room.pushState({
        usedIds,
        currentCardId,
        imageIndex,
        selectedCategories,
        allowRepeat,
        customQuestions: roomCustoms,
        hostId: roomMeta.hostId,
        drawnBy: roomMeta.drawnBy,
        turns: roomMeta.turns,
        ...updates,
      });
    }
  };

  const myName = playerName.trim() || 'Guest';

  // --- actions ---
  const handleDraw = () => {
    if (isDrawing || !canDraw || (turnsEnabled && !myTurn)) return;
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
        commit({
          currentCardId: card.id,
          usedIds: allowRepeat ? usedIds : [...usedIds, card.id],
          imageIndex: Math.floor(Math.random() * CARD_IMAGES.length),
          ...(room.active
            ? {
                drawnBy: myName,
                ...(turnsEnabled
                  ? { turns: { enabled: true, current: nextTurnId(roomMeta.turns.current) } }
                  : {}),
              }
            : {}),
        });
      }
      setIsDrawing(false);
    }, 280);
  };

  // "Not this one" — draw another without using the skipped question up
  const handleSkipCard = () => {
    if (isDrawing || !currentCardId || (turnsEnabled && !myTurn)) return;
    setIsDrawing(true);
    setTimeout(() => {
      const usedWithout = usedIds.filter((id) => id !== currentCardId);
      const usedWithoutSet = new Set(usedWithout);
      const pool = allQuestions.filter(
        (q) =>
          selectedCategories[q.category] &&
          q.id !== currentCardId &&
          (allowRepeat || !usedWithoutSet.has(q.id))
      );
      const card = drawRandomCard(pool);
      if (card) {
        commit({
          currentCardId: card.id,
          usedIds: allowRepeat ? usedWithout : [...usedWithout, card.id],
          imageIndex: Math.floor(Math.random() * CARD_IMAGES.length),
          ...(room.active ? { drawnBy: myName } : {}),
        });
      }
      setIsDrawing(false);
    }, 280);
  };

  const handleChooseCard = (question) => {
    if (turnsEnabled && !myTurn) return;
    commit({
      currentCardId: question.id,
      usedIds: usedSet.has(question.id) ? usedIds : [...usedIds, question.id],
      imageIndex: Math.floor(Math.random() * CARD_IMAGES.length),
      ...(room.active
        ? {
            drawnBy: myName,
            ...(turnsEnabled
              ? { turns: { enabled: true, current: nextTurnId(roomMeta.turns.current) } }
              : {}),
          }
        : {}),
    });
  };

  const handleReturnCard = (id) => commit({ usedIds: usedIds.filter((x) => x !== id) });

  const resetDeck = () => commit({ usedIds: [], currentCardId: null });

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
    const question = { id: newQuestionId(), en, zh, category, isCustom: true };
    commit({ customQuestions: [...activeCustoms, question] });
  };

  const handleToggleTurns = () => {
    const enabled = !roomMeta.turns.enabled;
    commit({
      turns: enabled
        ? { enabled: true, current: room.members[0]?.id ?? room.myId }
        : defaultTurns,
    });
  };

  const handleSkipTurn = () =>
    commit({ turns: { enabled: true, current: nextTurnId(roomMeta.turns.current) } });

  const handleShare = async () => {
    if (!currentCard) return;
    const result = await shareCardImage({
      question: currentCard,
      category: getCategoryDisplay(currentCard.category),
      imageUrl: currentImage,
      lang,
    });
    if (!result.shared && result.dataUrl) {
      setShareImage(result.dataUrl);
      setOpenSheet('share');
    }
  };

  const handleCreateRoom = async () => {
    const initial = {
      usedIds: [],
      currentCardId: null,
      imageIndex: Math.floor(Math.random() * CARD_IMAGES.length),
      selectedCategories,
      allowRepeat,
      customQuestions: [],
      hostId: room.myId,
      drawnBy: null,
      turns: defaultTurns,
    };
    const res = await room.createRoom(initial, myName);
    if (!res.error) applyRemoteState(initial);
  };

  const handleLeaveRoom = () => {
    room.leaveRoom();
    // restore the personal game from before joining
    const s = loadState() || {};
    setUsedIds(s.usedIds || []);
    setCurrentCardId(s.currentCardId ?? null);
    setImageIndex(s.imageIndex ?? 0);
    setSelectedCategories({ ...defaultCategories, ...(s.selectedCategories || {}) });
    setAllowRepeat(!!s.allowRepeat);
    setRoomCustoms([]);
    setRoomMeta({ hostId: null, drawnBy: null, turns: defaultTurns });
  };

  const closeSheet = () => setOpenSheet(null);

  return (
    <LanguageProvider lang={lang}>
      <div className="min-h-dvh bg-ivory flex flex-col">
        {/* Header: compact on mobile, full controls on desktop */}
        <header className="bg-white/95 backdrop-blur border-b-2 border-pale-pink/30 md:sticky md:top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-2">
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

              {room.active ? (
                <button
                  onClick={() => setOpenSheet('room')}
                  title={pick(lang, 'Room', '房间')}
                  className="h-11 px-3 rounded-full bg-blue-primary/10 border-2 border-blue-primary/30 text-blue-primary flex items-center gap-1.5 shrink-0"
                >
                  <UsersIcon className="w-4 h-4" />
                  <span className="font-hand text-sm tracking-[0.2em]">{room.code}</span>
                  <span className="text-xs opacity-70">{room.members.length}</span>
                </button>
              ) : (
                <HeaderIconButton
                  onClick={() => setOpenSheet('room')}
                  label={pick(lang, 'Play together', '联机同玩')}
                >
                  <UsersIcon className="w-5 h-5" />
                </HeaderIconButton>
              )}

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
              onSkipCard={handleSkipCard}
              onShare={handleShare}
              inRoom={room.active}
              drawnBy={roomMeta.drawnBy}
              turns={
                turnsEnabled ? { enabled: true, myTurn, currentName: currentTurnName } : null
              }
              onSkipTurn={handleSkipTurn}
            />
          ) : (
            <ChooseMode
              questionsByCategory={questionsByCategory}
              onCardSelected={handleChooseCard}
              usedIds={usedIds}
              image={currentImage}
              onShare={handleShare}
              blockedByName={turnsEnabled && !myTurn ? currentTurnName : null}
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
              commit({
                selectedCategories: { ...selectedCategories, [cat]: !selectedCategories[cat] },
              })
            }
            onSelectAll={() => commit({ selectedCategories: defaultCategories })}
            remaining={remaining}
            allowRepeat={allowRepeat}
            onToggleRepeat={() => commit({ allowRepeat: !allowRepeat })}
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

        <Sheet
          open={openSheet === 'room'}
          onClose={closeSheet}
          titleEn="Play Together"
          titleZh="联机同玩"
        >
          <RoomPanel
            room={room}
            playerName={playerName}
            onNameChange={setPlayerName}
            onCreate={handleCreateRoom}
            onLeave={handleLeaveRoom}
            turns={roomMeta.turns}
            isHost={isHost}
            onToggleTurns={handleToggleTurns}
          />
        </Sheet>

        <Sheet
          open={openSheet === 'share'}
          onClose={() => {
            setShareImage(null);
            closeSheet();
          }}
          titleEn="Share this card"
          titleZh="分享卡片"
        >
          {shareImage && (
            <div className="flex flex-col items-center gap-4 pb-2">
              <img
                src={shareImage}
                alt="Card to share"
                className="w-full max-w-xs rounded-2xl border-2 border-pale-pink/30"
              />
              <p className="text-sm text-gray-secondary text-center">
                <Bi en="Long-press the image to save or send" zh="长按图片保存或发送给朋友" />
              </p>
              <a
                href={shareImage}
                download="truth-card.png"
                className="px-6 py-2.5 min-h-[44px] rounded-full bg-blue-primary text-white shadow-btn active:scale-95 transition-transform inline-flex items-center"
              >
                <Bi en="Download" zh="下载图片" />
              </a>
            </div>
          )}
        </Sheet>
      </div>
    </LanguageProvider>
  );
}

export default App;
