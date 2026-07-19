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
import { usePWAUpdate } from './hooks/usePWAUpdate';
import ShuffleMode from './components/ShuffleMode';
import ChooseMode from './components/ChooseMode';
import Sheet from './components/Sheet';
import BottomBar from './components/BottomBar';
import FilterPanel from './components/FilterPanel';
import UsedPanel from './components/UsedPanel';
import CustomQuestionForm from './components/CustomQuestionForm';
import RoomPanel from './components/RoomPanel';
import InstallHint from './components/InstallHint';
import { CloseIcon, FilterIcon, PlusIcon, UsedIcon, UsersIcon } from './components/Icons';

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
  const [timerMin, setTimerMin] = useState(saved.timerMin || 0);
  const [customQuestions, setCustomQuestions] = useState(saved.customQuestions || []);
  const [usedIds, setUsedIds] = useState(saved.usedIds || []);
  const [selectedCategories, setSelectedCategories] = useState({
    ...defaultCategories,
    ...(saved.selectedCategories || {}),
  });
  const [selectedPacks, setSelectedPacks] = useState(saved.selectedPacks || {});
  const [allowRepeat, setAllowRepeat] = useState(saved.allowRepeat || false);
  const [sessionLimit, setSessionLimit] = useState(saved.sessionLimit ?? null);
  const [sessionStart, setSessionStart] = useState(saved.sessionStart || 0);
  const [currentCardId, setCurrentCardId] = useState(saved.currentCardId || null);
  const [imageIndex, setImageIndex] = useState(
    saved.imageIndex ?? Math.floor(Math.random() * CARD_IMAGES.length)
  );

  // --- transient state ---
  const [openSheet, setOpenSheet] = useState(null); // filter|used|add|room|share|null
  const [isDrawing, setIsDrawing] = useState(false);
  const [roomCustoms, setRoomCustoms] = useState([]);
  const [roomMeta, setRoomMeta] = useState({ hostId: null, drawnBy: null, turns: defaultTurns });
  const [shareImage, setShareImage] = useState(null);
  const [reactions, setReactions] = useState([]);

  const { needRefresh, applyUpdate, dismiss } = usePWAUpdate();
  const baseQuestions = useCloudQuestions();

  // --- reactions (rooms) ---
  const addReaction = useCallback((emoji, name) => {
    const id = Math.random().toString(36).slice(2);
    setReactions((prev) => [...prev.slice(-14), { id, emoji, name, x: 8 + Math.random() * 80 }]);
    setTimeout(() => setReactions((prev) => prev.filter((r) => r.id !== id)), 2600);
  }, []);

  // --- live room ---
  const applyRemoteState = useCallback((st) => {
    if (Array.isArray(st.usedIds)) setUsedIds(st.usedIds);
    setCurrentCardId(st.currentCardId ?? null);
    if (typeof st.imageIndex === 'number') setImageIndex(st.imageIndex);
    if (st.selectedCategories)
      setSelectedCategories({ ...defaultCategories, ...st.selectedCategories });
    if (st.selectedPacks) setSelectedPacks(st.selectedPacks);
    if (typeof st.allowRepeat === 'boolean') setAllowRepeat(st.allowRepeat);
    if ('sessionLimit' in st) setSessionLimit(st.sessionLimit ?? null);
    if (typeof st.sessionStart === 'number') setSessionStart(st.sessionStart);
    if (Array.isArray(st.customQuestions)) setRoomCustoms(st.customQuestions);
    setRoomMeta({
      hostId: st.hostId ?? null,
      drawnBy: st.drawnBy ?? null,
      turns: st.turns && typeof st.turns === 'object' ? st.turns : defaultTurns,
    });
  }, []);
  const room = useRoom({
    onRemoteState: applyRemoteState,
    onReaction: (p) => addReaction(p.emoji, p.name),
  });

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
  const packs = useMemo(
    () => [...new Set(baseQuestions.map((q) => q.pack).filter(Boolean))],
    [baseQuestions]
  );
  const packOn = useCallback(
    (q) => !q.pack || selectedPacks[q.pack] !== false,
    [selectedPacks]
  );
  const usedSet = useMemo(() => new Set(usedIds), [usedIds]);
  const activeDeck = useMemo(
    () => allQuestions.filter((q) => !usedSet.has(q.id)),
    [allQuestions, usedSet]
  );
  const filteredDeck = useMemo(
    () => activeDeck.filter((q) => selectedCategories[q.category] && packOn(q)),
    [activeDeck, selectedCategories, packOn]
  );
  const totalInSelected = useMemo(
    () => allQuestions.filter((q) => selectedCategories[q.category] && packOn(q)).length,
    [allQuestions, selectedCategories, packOn]
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
    const grouped = groupByCategory(activeDeck.filter(packOn));
    return Object.fromEntries(CATEGORIES.map((c) => [c, grouped[c].length]));
  }, [activeDeck, packOn]);
  const selectedCount = CATEGORIES.filter((c) => selectedCategories[c]).length;
  const questionsByCategory = useMemo(() => groupByCategory(allQuestions), [allQuestions]);
  const currentImage = CARD_IMAGES[imageIndex % CARD_IMAGES.length];

  // --- session presets ---
  const sessionDrawn = Math.max(0, usedIds.length - sessionStart);
  const sessionDone = !!sessionLimit && sessionDrawn >= sessionLimit;
  const sessionRecap = useMemo(() => {
    if (!sessionLimit) return null;
    const byId = new Map(allQuestions.map((q) => [q.id, q]));
    const counts = {};
    usedIds.slice(sessionStart).forEach((id) => {
      const q = byId.get(id);
      if (q) counts[q.category] = (counts[q.category] || 0) + 1;
    });
    return {
      total: sessionDrawn,
      byCategory: CATEGORIES.filter((c) => counts[c]).map((c) => ({
        key: c,
        ...getCategoryDisplay(c),
        count: counts[c],
      })),
    };
  }, [sessionLimit, sessionStart, usedIds, allQuestions, sessionDrawn]);

  const canDraw = (allowRepeat ? totalInSelected : filteredDeck.length) > 0 && !sessionDone;

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
  useEffect(() => {
    if (room.active) {
      saveState({
        ...(loadState() || {}),
        lang,
        mode,
        playerName,
        timerMin,
        roomCode: room.code,
      });
    } else {
      saveState({
        lang,
        mode,
        playerName,
        timerMin,
        roomCode: null,
        customQuestions,
        usedIds,
        selectedCategories,
        selectedPacks,
        allowRepeat,
        sessionLimit,
        sessionStart,
        currentCardId,
        imageIndex,
      });
    }
  }, [
    lang,
    mode,
    playerName,
    timerMin,
    room.active,
    room.code,
    customQuestions,
    usedIds,
    selectedCategories,
    selectedPacks,
    allowRepeat,
    sessionLimit,
    sessionStart,
    currentCardId,
    imageIndex,
  ]);

  // --- single state writer: applies locally and syncs to the room ---
  const commit = (updates) => {
    if ('usedIds' in updates) setUsedIds(updates.usedIds);
    if ('currentCardId' in updates) setCurrentCardId(updates.currentCardId);
    if ('imageIndex' in updates) setImageIndex(updates.imageIndex);
    if ('selectedCategories' in updates) setSelectedCategories(updates.selectedCategories);
    if ('selectedPacks' in updates) setSelectedPacks(updates.selectedPacks);
    if ('allowRepeat' in updates) setAllowRepeat(updates.allowRepeat);
    if ('sessionLimit' in updates) setSessionLimit(updates.sessionLimit);
    if ('sessionStart' in updates) setSessionStart(updates.sessionStart);
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
        selectedPacks,
        allowRepeat,
        sessionLimit,
        sessionStart,
        customQuestions: roomCustoms,
        hostId: roomMeta.hostId,
        drawnBy: roomMeta.drawnBy,
        turns: roomMeta.turns,
        ...updates,
      });
    }
  };

  const myName = playerName.trim() || 'Guest';

  // Anonymous draw/skip counters for admin curation (best-effort)
  const bumpStat = (id, kind) => {
    if (!supabase || String(id).startsWith('c')) return;
    supabase.rpc('bump_stat', { qid: id, kind }).then(
      () => {},
      () => {}
    );
  };

  // --- actions ---
  const handleDraw = () => {
    if (isDrawing || !canDraw || (turnsEnabled && !myTurn)) return;
    setIsDrawing(true);
    setTimeout(() => {
      const pool = allowRepeat
        ? allQuestions.filter(
            (q) => selectedCategories[q.category] && packOn(q) && q.id !== currentCardId
          )
        : filteredDeck;
      const source = pool.length
        ? pool
        : allQuestions.filter((q) => selectedCategories[q.category] && packOn(q));
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
        bumpStat(card.id, 'draw');
      }
      setIsDrawing(false);
    }, 280);
  };

  // "Not this one" — draw another without using the skipped question up
  const handleSkipCard = () => {
    if (isDrawing || !currentCardId || (turnsEnabled && !myTurn)) return;
    const skippedId = currentCardId;
    setIsDrawing(true);
    setTimeout(() => {
      const usedWithout = usedIds.filter((id) => id !== skippedId);
      const usedWithoutSet = new Set(usedWithout);
      const pool = allQuestions.filter(
        (q) =>
          selectedCategories[q.category] &&
          packOn(q) &&
          q.id !== skippedId &&
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
        bumpStat(skippedId, 'skip');
        bumpStat(card.id, 'draw');
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
    bumpStat(question.id, 'draw');
  };

  const handleReturnCard = (id) => commit({ usedIds: usedIds.filter((x) => x !== id) });

  const resetDeck = () => commit({ usedIds: [], currentCardId: null, sessionStart: 0 });

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

  const handleSuggest = async ({ en, zh, category }) => {
    if (!supabase) return false;
    const { error } = await supabase
      .from('suggestions')
      .insert({ en, zh, category, name: myName });
    return !error;
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

  const handleReact = (emoji) => {
    addReaction(emoji, myName);
    room.sendReaction(emoji, myName);
  };

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
      selectedPacks,
      allowRepeat,
      sessionLimit,
      sessionStart: 0,
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
    const s = loadState() || {};
    setUsedIds(s.usedIds || []);
    setCurrentCardId(s.currentCardId ?? null);
    setImageIndex(s.imageIndex ?? 0);
    setSelectedCategories({ ...defaultCategories, ...(s.selectedCategories || {}) });
    setSelectedPacks(s.selectedPacks || {});
    setAllowRepeat(!!s.allowRepeat);
    setSessionLimit(s.sessionLimit ?? null);
    setSessionStart(s.sessionStart || 0);
    setRoomCustoms([]);
    setRoomMeta({ hostId: null, drawnBy: null, turns: defaultTurns });
  };

  const closeSheet = () => setOpenSheet(null);

  return (
    <LanguageProvider lang={lang}>
      <div className="min-h-dvh bg-ivory flex flex-col">
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
              timerMin={timerMin}
              sessionDone={sessionDone}
              sessionRecap={sessionRecap}
              onContinueSession={() => commit({ sessionLimit: null, sessionStart: 0 })}
              inRoom={room.active}
              drawnBy={roomMeta.drawnBy}
              turns={
                turnsEnabled ? { enabled: true, myTurn, currentName: currentTurnName } : null
              }
              onSkipTurn={handleSkipTurn}
              onReact={handleReact}
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
          titleEn="Deck Settings"
          titleZh="卡组设置"
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
            packs={packs}
            selectedPacks={selectedPacks}
            onTogglePack={(p) =>
              commit({
                selectedPacks: { ...selectedPacks, [p]: selectedPacks[p] === false },
              })
            }
            sessionLimit={sessionLimit}
            onSetSession={(n) =>
              commit({ sessionLimit: n, sessionStart: n ? usedIds.length : 0 })
            }
            timerMin={timerMin}
            onSetTimer={setTimerMin}
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
          <CustomQuestionForm
            onAdd={handleAddCustomQuestion}
            onClose={closeSheet}
            canSuggest={Boolean(supabase)}
            onSuggest={handleSuggest}
          />
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

        {/* Floating reactions */}
        {reactions.length > 0 && (
          <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden" aria-hidden="true">
            {reactions.map((r) => (
              <span
                key={r.id}
                className="reaction-float absolute bottom-28 flex flex-col items-center"
                style={{ left: `${r.x}%` }}
              >
                <span className="text-3xl">{r.emoji}</span>
                <span className="text-[10px] text-gray-secondary bg-white/80 rounded-full px-1.5 mt-0.5">
                  {r.name}
                </span>
              </span>
            ))}
          </div>
        )}

        {/* New version toast */}
        {needRefresh && (
          <div className="fixed top-3 inset-x-3 md:inset-x-auto md:right-6 md:top-20 md:max-w-xs z-[70]">
            <div className="bg-ink text-white rounded-2xl p-3.5 flex items-center gap-3 shadow-card">
              <p className="flex-1 text-sm">
                <Bi en="A new version is ready" zh="有新版本啦" />
              </p>
              <button
                onClick={applyUpdate}
                className="px-4 py-2 rounded-full bg-white text-ink text-sm shrink-0"
              >
                <Bi en="Update" zh="更新" />
              </button>
              <button
                onClick={dismiss}
                aria-label="Dismiss"
                className="w-8 h-8 shrink-0 flex items-center justify-center text-white/70"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <InstallHint />
      </div>
    </LanguageProvider>
  );
}

export default App;
