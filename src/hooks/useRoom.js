import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

// No ambiguous characters (I/L/O/0/1)
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const ROOM_TTL_MS = 24 * 60 * 60 * 1000;

const genCode = () =>
  Array.from({ length: 4 }, () => CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]).join('');

function getClientId() {
  try {
    let id = localStorage.getItem('truthcards:clientId');
    if (!id) {
      id = Math.random().toString(36).slice(2, 10);
      localStorage.setItem('truthcards:clientId', id);
    }
    return id;
  } catch {
    return Math.random().toString(36).slice(2, 10);
  }
}

/**
 * Live shared room over Supabase Realtime.
 * The whole game state lives in one jsonb row; every action pushes the full
 * state (last-write-wins), and every member applies updates that aren't their
 * own echo (guarded by clientId). Presence tracks who is in the room by name,
 * ordered deterministically (join time) so take-turns works identically on
 * every device.
 */
export function useRoom({ onRemoteState }) {
  const [code, setCode] = useState(null);
  const [members, setMembers] = useState([]); // [{ id, name, joined }]
  const [status, setStatus] = useState('idle'); // 'idle' | 'connecting' | 'in'
  const [error, setError] = useState(null);

  const channelRef = useRef(null);
  const codeRef = useRef(null);
  const revRef = useRef(0);
  const clientIdRef = useRef(getClientId());
  const onRemoteRef = useRef(onRemoteState);
  onRemoteRef.current = onRemoteState;

  const teardown = useCallback(() => {
    if (channelRef.current && supabase) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, []);

  const subscribeToRoom = useCallback(
    (roomCode, name) => {
      teardown();
      const ch = supabase.channel(`room:${roomCode}`, {
        config: { presence: { key: clientIdRef.current } },
      });
      ch.on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `code=eq.${roomCode}` },
        (payload) => {
          const st = payload.new?.state;
          if (!st || st.clientId === clientIdRef.current) return; // our own echo
          if ((st.rev || 0) <= revRef.current) return; // stale
          revRef.current = st.rev || 0;
          onRemoteRef.current?.(st);
        }
      );
      ch.on('presence', { event: 'sync' }, () => {
        const state = ch.presenceState();
        const list = Object.entries(state)
          .map(([id, metas]) => ({
            id,
            name: metas[0]?.name || 'Guest',
            joined: metas[0]?.joined || 0,
          }))
          .sort((a, b) => a.joined - b.joined || a.id.localeCompare(b.id));
        setMembers(list);
      });
      ch.subscribe((s) => {
        if (s === 'SUBSCRIBED') ch.track({ name: name || 'Guest', joined: Date.now() });
      });
      channelRef.current = ch;
    },
    [teardown]
  );

  const enterRoom = useCallback(
    (roomCode, name) => {
      subscribeToRoom(roomCode, name);
      codeRef.current = roomCode;
      setCode(roomCode);
      setStatus('in');
      setError(null);
    },
    [subscribeToRoom]
  );

  /** Create a fresh room seeded with `initialState`. */
  const createRoom = useCallback(
    async (initialState, name) => {
      if (!supabase) return { error: 'not-configured' };
      setStatus('connecting');
      setError(null);
      for (let attempt = 0; attempt < 5; attempt++) {
        const newCode = genCode();
        revRef.current = 1;
        const { error: err } = await supabase
          .from('rooms')
          .insert({ code: newCode, state: { ...initialState, clientId: clientIdRef.current, rev: 1 } });
        if (!err) {
          enterRoom(newCode, name);
          return { code: newCode };
        }
        if (err.code !== '23505') {
          // anything other than "code already taken"
          setStatus('idle');
          setError('create-failed');
          return { error: 'create-failed' };
        }
      }
      setStatus('idle');
      setError('create-failed');
      return { error: 'create-failed' };
    },
    [enterRoom]
  );

  /** Join an existing room by code; applies its current state. */
  const joinRoom = useCallback(
    async (rawCode, { silent = false, name } = {}) => {
      if (!supabase) return { error: 'not-configured' };
      const roomCode = String(rawCode || '').trim().toUpperCase();
      if (roomCode.length !== 4) {
        if (!silent) setError('room-not-found');
        return { error: 'room-not-found' };
      }
      setStatus('connecting');
      setError(null);
      const { data, error: err } = await supabase
        .from('rooms')
        .select('code, state, created_at')
        .eq('code', roomCode)
        .maybeSingle();
      const expired = data && Date.now() - new Date(data.created_at).getTime() > ROOM_TTL_MS;
      if (err || !data || expired) {
        setStatus('idle');
        if (!silent) setError('room-not-found');
        return { error: 'room-not-found' };
      }
      revRef.current = data.state?.rev || 0;
      if (data.state && Object.keys(data.state).length) onRemoteRef.current?.(data.state);
      enterRoom(roomCode, name);
      return { code: roomCode };
    },
    [enterRoom]
  );

  /** Push the full game state to everyone in the room. */
  const pushState = useCallback((gameState) => {
    if (!supabase || !codeRef.current) return;
    const rev = ++revRef.current;
    supabase
      .from('rooms')
      .update({
        state: { ...gameState, clientId: clientIdRef.current, rev },
        updated_at: new Date().toISOString(),
      })
      .eq('code', codeRef.current)
      .then(({ error: err }) => {
        if (err) console.warn('room sync failed:', err.message);
      });
  }, []);

  const leaveRoom = useCallback(() => {
    teardown();
    codeRef.current = null;
    setCode(null);
    setMembers([]);
    setStatus('idle');
    setError(null);
  }, [teardown]);

  useEffect(() => () => teardown(), [teardown]);

  return {
    active: status === 'in',
    connecting: status === 'connecting',
    code,
    members,
    myId: clientIdRef.current,
    error,
    clearError: () => setError(null),
    createRoom,
    joinRoom,
    pushState,
    leaveRoom,
  };
}
