import React, { createContext, useContext } from 'react';

// Display language: 'en' | 'zh' | 'both'
const LangContext = createContext('both');

export const LanguageProvider = ({ lang, children }) => (
  <LangContext.Provider value={lang}>{children}</LangContext.Provider>
);

export const useLang = () => useContext(LangContext);

// Plain-string helper (for labels, confirm dialogs, aria)
export const pick = (lang, en, zh) =>
  lang === 'en' ? en : lang === 'zh' ? zh : `${en} / ${zh}`;

/**
 * Bilingual inline text that respects the language setting.
 * <Bi en="Shuffle" zh="抽卡" /> renders one or both depending on `lang`.
 */
export function Bi({ en, zh, sep = ' / ', className = '', enClass = 'font-hand', zhClass = 'font-zh' }) {
  const lang = useLang();
  if (lang === 'en') return <span className={`${enClass} ${className}`}>{en}</span>;
  if (lang === 'zh') return <span className={`${zhClass} ${className}`}>{zh}</span>;
  return (
    <span className={className}>
      <span className={enClass}>{en}</span>
      <span className="opacity-40">{sep}</span>
      <span className={zhClass}>{zh}</span>
    </span>
  );
}
