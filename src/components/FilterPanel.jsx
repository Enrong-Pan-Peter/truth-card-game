import React from 'react';
import { CATEGORIES, getCategoryDisplay } from '../utils/gameUtils';
import { Bi, useLang } from '../i18n';

const CategoryLabel = ({ en, zh }) => {
  const lang = useLang();
  if (lang === 'en') return <span className="font-hand text-[15px] text-ink">{en}</span>;
  if (lang === 'zh') return <span className="font-zh text-[15px] text-ink">{zh}</span>;
  return (
    <span className="block">
      <span className="block font-hand text-[15px] leading-tight text-ink">{en}</span>
      <span className="block font-zh text-xs text-gray-secondary">{zh}</span>
    </span>
  );
};

export const Toggle = ({ on, onChange, label }) => (
  <button
    onClick={onChange}
    role="switch"
    aria-checked={on}
    aria-label={label}
    className={`relative w-12 h-7 rounded-full transition-colors duration-300 shrink-0 ${
      on ? 'bg-blue-primary' : 'bg-pale-pink'
    }`}
  >
    <span
      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
        on ? 'translate-x-5' : ''
      }`}
    />
  </button>
);

/** Category filter + game options. Lives in a Sheet. */
const FilterPanel = ({
  selectedCategories,
  onToggleCategory,
  onSelectAll,
  remaining,
  allowRepeat,
  onToggleRepeat,
}) => {
  const allSelected = CATEGORIES.every((c) => selectedCategories[c]);

  return (
    <div className="space-y-2">
      {CATEGORIES.map((cat) => {
        const d = getCategoryDisplay(cat);
        const on = !!selectedCategories[cat];
        return (
          <label
            key={cat}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-colors min-h-[52px] ${
              on ? 'border-orange-primary/50 bg-orange-primary/10' : 'border-pale-pink/25 bg-ivory/50'
            }`}
          >
            <input type="checkbox" checked={on} onChange={() => onToggleCategory(cat)} />
            <span className="flex-1 min-w-0">
              <CategoryLabel en={d.en} zh={d.zh} />
            </span>
            <span className="text-xs text-gray-secondary shrink-0">
              {remaining[cat] ?? 0} <Bi en="left" zh="剩" />
            </span>
          </label>
        );
      })}

      {!allSelected && (
        <button
          onClick={onSelectAll}
          className="w-full py-2.5 min-h-[44px] rounded-xl text-sm text-blue-primary border-2 border-dashed border-blue-primary/40"
        >
          <Bi en="Select all" zh="全选" />
        </button>
      )}

      <div className="flex items-center justify-between gap-3 pt-4 mt-3 border-t-2 border-pale-pink/20">
        <div className="min-w-0">
          <p className="text-[15px] text-ink">
            <Bi en="Allow repeats" zh="允许重复" />
          </p>
          <p className="text-xs text-gray-secondary mt-0.5">
            <Bi en="Drawn cards stay in the deck" zh="抽过的卡不移出卡组" />
          </p>
        </div>
        <Toggle on={allowRepeat} onChange={onToggleRepeat} label="Allow repeats" />
      </div>
    </div>
  );
};

export default FilterPanel;
