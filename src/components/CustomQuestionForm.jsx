import React, { useState } from 'react';
import { CATEGORIES, getCategoryDisplay } from '../utils/gameUtils';
import { Bi, pick, useLang } from '../i18n';

/** Add-your-own-question form. Lives in a Sheet. */
const CustomQuestionForm = ({ onAdd, onClose }) => {
  const lang = useLang();
  const [en, setEn] = useState('');
  const [zh, setZh] = useState('');
  const [category, setCategory] = useState('getting_to_know');

  const handleSubmit = (e) => {
    e.preventDefault();
    const enT = en.trim();
    const zhT = zh.trim();
    if (!enT && !zhT) return;
    // Fall back to the filled language so the card never renders empty
    onAdd({ en: enT || zhT, zh: zhT || enT, category });
    setEn('');
    setZh('');
    onClose();
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border-2 border-pale-pink/40 bg-white text-ink focus:border-blue-primary/60 focus:outline-none transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm mb-2 text-ink">
          <Bi en="Category" zh="类别" />
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`${inputClass} min-h-[48px]`}
        >
          {CATEGORIES.map((c) => {
            const d = getCategoryDisplay(c);
            return (
              <option key={c} value={c}>
                {pick(lang, d.en, d.zh)}
              </option>
            );
          })}
        </select>
      </div>

      <div>
        <label className="block text-sm mb-2 text-ink font-hand">Question (English)</label>
        <textarea
          value={en}
          onChange={(e) => setEn(e.target.value)}
          placeholder="Enter your question in English..."
          rows={2}
          className={`${inputClass} font-hand resize-none`}
        />
      </div>

      <div>
        <label className="block text-sm mb-2 text-ink font-zh">问题（中文）</label>
        <textarea
          value={zh}
          onChange={(e) => setZh(e.target.value)}
          placeholder="输入你的中文问题..."
          rows={2}
          className={`${inputClass} font-zh resize-none`}
        />
      </div>

      <div className="rounded-xl p-3.5 text-xs text-gray-secondary bg-orange-primary/15 leading-relaxed">
        <Bi
          en="Fill in at least one language. Custom questions are saved on this device."
          zh="至少填写一种语言。自定义问题会保存在本设备上。"
          sep=" "
        />
      </div>

      <div className="flex gap-3 justify-end pt-1">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 min-h-[48px] rounded-full text-gray-secondary bg-pale-pink/20 active:scale-95 transition-transform"
        >
          <Bi en="Cancel" zh="取消" />
        </button>
        <button
          type="submit"
          disabled={!en.trim() && !zh.trim()}
          className="px-6 py-3 min-h-[48px] rounded-full text-white bg-blue-primary shadow-btn disabled:opacity-40 active:scale-95 transition-transform"
        >
          <Bi en="Add Question" zh="添加问题" />
        </button>
      </div>
    </form>
  );
};

export default CustomQuestionForm;
