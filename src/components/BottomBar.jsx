import React from 'react';
import { useLang } from '../i18n';
import { ShuffleIcon, ListIcon, FilterIcon, UsedIcon, PlusIcon } from './Icons';

const Badge = ({ children }) => (
  <span className="absolute top-1 left-1/2 translate-x-2.5 min-w-[17px] h-[17px] px-1 rounded-full bg-orange-primary text-white text-[10px] leading-[17px] text-center shadow-sm">
    {children}
  </span>
);

/** Mobile-only bottom action bar (thumb zone). */
const BottomBar = ({ mode, onModeChange, onOpenSheet, usedCount, filterCount, totalCategories }) => {
  const lang = useLang();
  const t = (en, zh) => (lang === 'en' ? en : zh);
  const base =
    'relative flex flex-col items-center justify-center gap-1 h-full active:scale-95 transition-transform';

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t-2 border-pale-pink/20 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 h-16">
        <button
          className={`${base} ${mode === 'shuffle' ? 'text-blue-primary' : 'text-gray-secondary'}`}
          onClick={() => onModeChange('shuffle')}
          aria-pressed={mode === 'shuffle'}
        >
          <ShuffleIcon className="w-6 h-6" strokeWidth={mode === 'shuffle' ? 2.4 : 1.8} />
          <span className="text-[11px] leading-none">{t('Shuffle', '抽卡')}</span>
        </button>

        <button
          className={`${base} ${mode === 'choose' ? 'text-blue-primary' : 'text-gray-secondary'}`}
          onClick={() => onModeChange('choose')}
          aria-pressed={mode === 'choose'}
        >
          <ListIcon className="w-6 h-6" strokeWidth={mode === 'choose' ? 2.4 : 1.8} />
          <span className="text-[11px] leading-none">{t('Choose', '选择')}</span>
        </button>

        <button className={`${base} text-gray-secondary`} onClick={() => onOpenSheet('filter')}>
          <FilterIcon className="w-6 h-6" />
          {filterCount < totalCategories && <Badge>{filterCount}</Badge>}
          <span className="text-[11px] leading-none">{t('Filter', '筛选')}</span>
        </button>

        <button className={`${base} text-gray-secondary`} onClick={() => onOpenSheet('used')}>
          <UsedIcon className="w-6 h-6" />
          {usedCount > 0 && <Badge>{usedCount > 99 ? '99+' : usedCount}</Badge>}
          <span className="text-[11px] leading-none">{t('Used', '已用')}</span>
        </button>

        <button className={`${base} text-gray-secondary`} onClick={() => onOpenSheet('add')}>
          <span className="w-7 h-7 rounded-full bg-orange-primary text-white flex items-center justify-center shadow-btn-orange">
            <PlusIcon className="w-5 h-5" strokeWidth={2.2} />
          </span>
          <span className="text-[11px] leading-none">{t('Add', '添加')}</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomBar;
