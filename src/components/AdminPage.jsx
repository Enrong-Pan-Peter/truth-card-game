import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { CATEGORIES, getCategoryDisplay } from '../utils/gameUtils';
import { CloseIcon, PencilIcon, PlusIcon, TrashIcon } from './Icons';

const PREFIX = {
  getting_to_know: 'gk',
  ideals_reals: 'ir',
  heart_to_heart: 'hh',
  memories: 'mem',
  matters_of_soul: 'ms',
};

const nextId = (category, questions) => {
  const prefix = PREFIX[category];
  const nums = questions
    .filter((q) => q.category === category && q.id.startsWith(prefix))
    .map((q) => parseInt(q.id.slice(prefix.length), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `${prefix}${String(next).padStart(3, '0')}`;
};

const input =
  'w-full px-3 py-2 rounded-lg border-2 border-pale-pink/40 bg-white text-ink text-sm focus:border-blue-primary/60 focus:outline-none';

const QuestionRow = ({ q, onSave, onToggle, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [en, setEn] = useState(q.en);
  const [zh, setZh] = useState(q.zh);

  if (editing) {
    return (
      <div className="p-3 rounded-xl bg-white border-2 border-blue-primary/40 space-y-2">
        <p className="text-xs text-gray-secondary">{q.id}</p>
        <textarea value={en} onChange={(e) => setEn(e.target.value)} rows={2} className={input} />
        <textarea value={zh} onChange={(e) => setZh(e.target.value)} rows={2} className={`${input} font-zh`} />
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              setEn(q.en);
              setZh(q.zh);
              setEditing(false);
            }}
            className="px-4 py-1.5 rounded-full text-sm bg-pale-pink/20 text-gray-secondary"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              await onSave(q.id, { en: en.trim(), zh: zh.trim() });
              setEditing(false);
            }}
            className="px-4 py-1.5 rounded-full text-sm bg-blue-primary text-white"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-3 rounded-xl border-2 flex items-start gap-3 ${
        q.enabled ? 'bg-white border-pale-pink/25' : 'bg-pale-pink/10 border-pale-pink/20 opacity-60'
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-secondary">
          {q.id}
          {!q.enabled && <span className="ml-2 text-orange-primary">disabled</span>}
        </p>
        <p className="text-sm text-ink font-hand mt-0.5">{q.en}</p>
        <p className="text-sm text-gray-secondary font-zh">{q.zh}</p>
      </div>
      <div className="flex flex-col gap-1.5 shrink-0">
        <button
          onClick={() => setEditing(true)}
          title="Edit"
          className="w-9 h-9 rounded-lg bg-blue-primary/10 text-blue-primary flex items-center justify-center"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onToggle(q.id, !q.enabled)}
          title={q.enabled ? 'Disable' : 'Enable'}
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${
            q.enabled ? 'bg-orange-primary/15 text-orange-primary' : 'bg-blue-primary/10 text-blue-primary'
          }`}
        >
          {q.enabled ? 'OFF' : 'ON'}
        </button>
        <button
          onClick={() => {
            if (window.confirm(`Delete ${q.id}? This cannot be undone.`)) onDelete(q.id);
          }}
          title="Delete"
          className="w-9 h-9 rounded-lg bg-pale-pink/20 text-gray-secondary flex items-center justify-center"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/** Question-bank manager at /#/admin — magic-link login, admin-only writes (RLS). */
const AdminPage = () => {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [email, setEmail] = useState('');
  const [linkSent, setLinkSent] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState(null);
  const [newQ, setNewQ] = useState({ category: 'getting_to_know', en: '', zh: '' });

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadQuestions = async () => {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('category')
      .order('sort');
    if (error) setStatus(error.message);
    else setQuestions(data || []);
  };

  useEffect(() => {
    if (session) loadQuestions();
  }, [session]);

  const run = async (op, refresh = true) => {
    setStatus(null);
    const { error } = await op;
    if (error) {
      setStatus(
        `${error.message} — if this is a permissions error, your login email must be in the "admins" table.`
      );
      return false;
    }
    if (refresh) await loadQuestions();
    return true;
  };

  if (!isSupabaseConfigured) {
    return (
      <Shell>
        <p className="text-center text-gray-secondary py-16">
          Supabase isn't configured. See SETUP-SUPABASE.md.
        </p>
      </Shell>
    );
  }

  if (session === undefined) {
    return (
      <Shell>
        <p className="text-center text-gray-secondary py-16">Loading…</p>
      </Shell>
    );
  }

  if (!session) {
    return (
      <Shell>
        <div className="max-w-sm mx-auto py-12 space-y-4 text-center">
          <h2 className="text-2xl text-ink">Admin sign in</h2>
          <p className="text-sm text-gray-secondary">
            Enter the admin email — you'll get a magic sign-in link.
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setStatus(null);
              const { error } = await supabase.auth.signInWithOtp({
                email: email.trim(),
                options: {
                  emailRedirectTo: `${window.location.origin}${window.location.pathname}#/admin`,
                },
              });
              if (error) setStatus(error.message);
              else setLinkSent(true);
            }}
            className="space-y-3"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`${input} min-h-[48px] text-center`}
            />
            <button
              type="submit"
              className="w-full py-3 min-h-[48px] rounded-full bg-blue-primary text-white shadow-btn"
            >
              Send magic link
            </button>
          </form>
          {linkSent && (
            <p className="text-sm text-blue-primary">Check your email and open the link ✉️</p>
          )}
          {status && <p className="text-sm text-orange-primary">{status}</p>}
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      right={
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-sm text-gray-secondary underline underline-offset-2"
        >
          Sign out
        </button>
      }
    >
      <div className="space-y-6 pb-16">
        <p className="text-sm text-gray-secondary">
          Signed in as <span className="text-ink">{session.user.email}</span>. Changes go live for
          everyone on their next visit — no redeploy needed.
        </p>

        {/* Add new question */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!newQ.en.trim() && !newQ.zh.trim()) return;
            const en = newQ.en.trim() || newQ.zh.trim();
            const zh = newQ.zh.trim() || newQ.en.trim();
            const sort =
              Math.max(0, ...questions.filter((q) => q.category === newQ.category).map((q) => q.sort)) + 1;
            const ok = await run(
              supabase
                .from('questions')
                .insert({ id: nextId(newQ.category, questions), category: newQ.category, en, zh, sort })
            );
            if (ok) setNewQ({ ...newQ, en: '', zh: '' });
          }}
          className="p-4 rounded-2xl bg-white border-2 border-orange-primary/30 space-y-2"
        >
          <p className="text-sm text-ink flex items-center gap-1.5">
            <PlusIcon className="w-4 h-4 text-orange-primary" /> Add a question
          </p>
          <select
            value={newQ.category}
            onChange={(e) => setNewQ({ ...newQ, category: e.target.value })}
            className={input}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {getCategoryDisplay(c).en} / {getCategoryDisplay(c).zh}
              </option>
            ))}
          </select>
          <textarea
            value={newQ.en}
            onChange={(e) => setNewQ({ ...newQ, en: e.target.value })}
            placeholder="English…"
            rows={2}
            className={input}
          />
          <textarea
            value={newQ.zh}
            onChange={(e) => setNewQ({ ...newQ, zh: e.target.value })}
            placeholder="中文…"
            rows={2}
            className={`${input} font-zh`}
          />
          <button
            type="submit"
            disabled={!newQ.en.trim() && !newQ.zh.trim()}
            className="px-6 py-2.5 rounded-full bg-blue-primary text-white text-sm shadow-btn disabled:opacity-40"
          >
            Add
          </button>
        </form>

        {status && (
          <p className="text-sm text-orange-primary p-3 rounded-xl bg-orange-primary/10">{status}</p>
        )}

        {/* Question list grouped by category */}
        {CATEGORIES.map((cat) => {
          const list = questions.filter((q) => q.category === cat);
          const d = getCategoryDisplay(cat);
          return (
            <section key={cat} className="space-y-2">
              <h3 className="text-lg text-ink pt-2">
                {d.en} <span className="font-zh text-gray-secondary text-sm">{d.zh}</span>{' '}
                <span className="text-xs text-gray-secondary">({list.length})</span>
              </h3>
              {list.map((q) => (
                <QuestionRow
                  key={q.id}
                  q={q}
                  onSave={(id, patch) => run(supabase.from('questions').update(patch).eq('id', id))}
                  onToggle={(id, enabled) =>
                    run(supabase.from('questions').update({ enabled }).eq('id', id))
                  }
                  onDelete={(id) => run(supabase.from('questions').delete().eq('id', id))}
                />
              ))}
            </section>
          );
        })}
      </div>
    </Shell>
  );
};

const Shell = ({ children, right }) => (
  <div className="min-h-dvh bg-ivory">
    <header className="bg-white/95 border-b-2 border-pale-pink/30 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <h1 className="font-hand text-xl text-ink">Truth Cards · Admin</h1>
        <div className="flex items-center gap-4">
          {right}
          <a
            href="#/"
            title="Back to game"
            className="w-9 h-9 rounded-full bg-ivory border-2 border-pale-pink/30 text-gray-secondary flex items-center justify-center"
          >
            <CloseIcon className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
    <main className="max-w-3xl mx-auto px-4 py-6">{children}</main>
  </div>
);

export default AdminPage;
