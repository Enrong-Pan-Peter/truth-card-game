import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { isSupabaseConfigured } from '../lib/supabase';
import { Bi, pick, useLang } from '../i18n';
import { CopyIcon, LeaveIcon, UsersIcon } from './Icons';
import { Toggle } from './FilterPanel';

const roomUrl = (code) => `${window.location.origin}${window.location.pathname}?room=${code}`;

/** Create / join / manage a live shared room. Lives in a Sheet. */
const RoomPanel = ({ room, playerName, onNameChange, onCreate, onLeave, turns, isHost, onToggleTurns }) => {
  const lang = useLang();
  const [joinCode, setJoinCode] = useState('');
  const [qr, setQr] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!room.active || !room.code) {
      setQr(null);
      return;
    }
    QRCode.toDataURL(roomUrl(room.code), { width: 220, margin: 1, color: { dark: '#282828', light: '#FFFFFF' } })
      .then(setQr)
      .catch(() => setQr(null));
  }, [room.active, room.code]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl(room.code));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="text-center py-10 text-gray-secondary space-y-2 px-2">
        <UsersIcon className="w-12 h-12 mx-auto opacity-30" />
        <p>
          <Bi en="Live rooms aren't set up yet." zh="联机房间还没有配置。" />
        </p>
        <p className="text-xs opacity-70">See SETUP-SUPABASE.md</p>
      </div>
    );
  }

  if (room.active) {
    return (
      <div className="flex flex-col items-center gap-5 text-center pb-2">
        <p className="text-sm text-gray-secondary">
          <Bi en="Share this code or QR — everyone sees the same card" zh="分享房间码或二维码，大家看到同一张卡" />
        </p>

        <div className="px-8 py-4 rounded-2xl bg-ivory border-2 border-orange-primary/40">
          <p className="font-hand text-5xl tracking-[0.3em] text-ink pl-[0.3em]">{room.code}</p>
        </div>

        {qr && (
          <img
            src={qr}
            alt={`QR code to join room ${room.code}`}
            className="w-44 h-44 rounded-xl border-2 border-pale-pink/30 bg-white p-1"
          />
        )}

        {/* Members */}
        <div className="w-full">
          <p className="text-xs text-gray-secondary mb-2 flex items-center justify-center gap-1.5">
            <UsersIcon className="w-4 h-4" />
            {room.members.length} <Bi en={room.members.length === 1 ? 'person here' : 'people here'} zh="人在房间里" />
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {room.members.map((m) => (
              <span
                key={m.id}
                className={`px-3 py-1 rounded-full text-xs border-2 ${
                  m.id === room.myId
                    ? 'bg-blue-primary/10 border-blue-primary/40 text-blue-primary'
                    : 'bg-ivory border-pale-pink/30 text-gray-secondary'
                } ${turns?.enabled && turns.current === m.id ? 'ring-2 ring-orange-primary/60' : ''}`}
              >
                {m.name}
                {m.id === room.myId && <Bi en=" (you)" zh="（你）" />}
              </span>
            ))}
          </div>
        </div>

        {/* Take-turns (host only) */}
        {isHost && (
          <div className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-ivory/70 border-2 border-pale-pink/25 text-left">
            <div className="min-w-0">
              <p className="text-[15px] text-ink">
                <Bi en="Take turns" zh="轮流抽卡" />
              </p>
              <p className="text-xs text-gray-secondary mt-0.5">
                <Bi en="Only the current player can draw" zh="只有轮到的人可以抽卡" />
              </p>
            </div>
            <Toggle on={!!turns?.enabled} onChange={onToggleTurns} label="Take turns" />
          </div>
        )}
        {!isHost && turns?.enabled && (
          <p className="text-xs text-gray-secondary">
            <Bi en="Take-turns mode is on" zh="轮流模式已开启" />
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={copyLink}
            className="px-5 py-2.5 min-h-[44px] rounded-full bg-blue-primary/10 text-blue-primary flex items-center gap-2 active:scale-95 transition-transform"
          >
            <CopyIcon className="w-4 h-4" />
            {copied ? <Bi en="Copied!" zh="已复制！" /> : <Bi en="Copy link" zh="复制链接" />}
          </button>
          <button
            onClick={onLeave}
            className="px-5 py-2.5 min-h-[44px] rounded-full bg-orange-primary text-white shadow-btn-orange flex items-center gap-2 active:scale-95 transition-transform"
          >
            <LeaveIcon className="w-4 h-4" />
            <Bi en="Leave room" zh="离开房间" />
          </button>
        </div>

        <p className="text-xs text-gray-secondary opacity-80">
          <Bi en="Rooms last 24h" zh="房间保留24小时" />
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-2">
      {/* Name */}
      <div>
        <label className="block text-sm text-ink mb-2">
          <Bi en="Your name" zh="你的名字" />
        </label>
        <input
          value={playerName}
          onChange={(e) => onNameChange(e.target.value.slice(0, 16))}
          placeholder={pick(lang, 'e.g. Peter', '例如：小明')}
          className="w-full px-4 py-3 min-h-[48px] rounded-xl border-2 border-pale-pink/40 bg-white text-ink focus:border-blue-primary/60 focus:outline-none"
        />
      </div>

      <div className="text-center space-y-3">
        <p className="text-sm text-gray-secondary">
          <Bi
            en="Play together — every phone shows the same card in real time"
            zh="一起玩——每台手机实时显示同一张卡"
          />
        </p>
        <button
          onClick={onCreate}
          disabled={room.connecting}
          className="px-8 py-3.5 min-h-[52px] rounded-full bg-blue-primary text-white text-lg shadow-btn active:scale-95 transition-transform disabled:opacity-50"
        >
          {room.connecting ? (
            <Bi en="Connecting..." zh="连接中..." />
          ) : (
            <Bi en="Create a room" zh="创建房间" />
          )}
        </button>
        <p className="text-xs text-gray-secondary opacity-70">
          <Bi en="Starts a fresh deck for the group" zh="为整组开始一副新卡组" />
        </p>
      </div>

      <div className="flex items-center gap-3 text-gray-secondary/60">
        <span className="flex-1 border-t-2 border-pale-pink/30" />
        <span className="text-xs">
          <Bi en="or" zh="或" />
        </span>
        <span className="flex-1 border-t-2 border-pale-pink/30" />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (joinCode.trim().length === 4) {
            room.joinRoom(joinCode, { name: playerName || 'Guest' });
            setJoinCode('');
          }
        }}
        className="space-y-3"
      >
        <label className="block text-sm text-ink text-center">
          <Bi en="Have a code? Join a room" zh="有房间码？加入房间" />
        </label>
        <div className="flex gap-2 justify-center">
          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4))}
            placeholder="ABCD"
            autoCapitalize="characters"
            autoComplete="off"
            className="w-36 px-4 py-3 min-h-[52px] rounded-xl border-2 border-pale-pink/40 bg-white text-ink text-center font-hand text-2xl tracking-[0.25em] focus:border-blue-primary/60 focus:outline-none"
            aria-label={pick(lang, 'Room code', '房间码')}
          />
          <button
            type="submit"
            disabled={joinCode.length !== 4 || room.connecting}
            className="px-6 min-h-[52px] rounded-xl bg-orange-primary text-white shadow-btn-orange disabled:opacity-40 active:scale-95 transition-transform"
          >
            <Bi en="Join" zh="加入" />
          </button>
        </div>
        {room.error === 'room-not-found' && (
          <p className="text-center text-sm text-orange-primary">
            <Bi en="Room not found or expired" zh="房间不存在或已过期" />
          </p>
        )}
        {room.error === 'create-failed' && (
          <p className="text-center text-sm text-orange-primary">
            <Bi en="Couldn't create the room — check your connection" zh="创建失败——请检查网络" />
          </p>
        )}
      </form>
    </div>
  );
};

export default RoomPanel;
