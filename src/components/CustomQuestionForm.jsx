import React, { useState } from 'react';
import { CATEGORIES, getCategoryDisplay } from '../utils/gameUtils';
import { Bi, pick, useLang } from '../i18n';

/** Add-your-own-question form. Lives in a Sheet. */
const CustomQuestionForm = ({ onAdd, onClose, canSuggest, onSuggest }) => {
  const lang = useLang();
  const [en, setEn] = useState('');
  const [zh, setZh] = useState('');
  const [category, setCategory] = useState('getting_to_know');
  const [suggestState, setSuggestState] = useState(null); // null | 'sending' | 'sent' | 'failed'

  const payload = () => {
    const enT = en.trim();
    const zhT = zh.trim();
    if (!enT && !zhT) return null;
    // Fall back to the filled language so the card never renders empty
    return { en: enT || zhT, zh: zhT || enT, category };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = payload();
    if (!data) return;
    onAdd(data);
    setEn('');
    setZh('');
    onClose();
  };

  const handleSuggest = async () => {
    const data = payload();
    if (!data || suggestState === 'sending') return;
    setSuggestState('sending');
    const ok = await onSuggest(data);
    setSuggestState(ok ? 'sent' : 'failed');
    if (ok) {
      setEn('');
      setZh('');
    }
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

      {canSuggest && (
        <div className="pt-3 mt-1 border-t-2 border-pale-pink/20 text-center space-y-2">
          <p className="text-xs text-gray-secondary">
            <Bi
              en="Like it? Suggest it for the shared question bank"
              zh="觉得不错？推荐给公共题库，管理员审核后大家都能抽到"
              sep=" · "
            />
          </p>
          <button
            type="button"
            onClick={handleSuggest}
            disabled={(!en.trim() && !zh.trim()) || suggestState === 'sending'}
            className="px-5 py-2.5 min-h-[44px] rounded-full text-sm text-orange-primary border-2 border-orange-primary/50 disabled:opacity-40 active:scale-95 transition-transform"
          >
            {suggestState === 'sending' ? (
              <Bi en="Sending..." zh="提交中..." />
            ) : (
              <Bi en="Suggest to the bank" zh="推荐到题库" />
            )}
          </button>
          {suggestState === 'sent' && (
            <p className="text-xs text-blue-primary">
              <Bi en="Sent! It will appear once approved." zh="已提交！审核通过后就会出现。" />
            </p>
          )}
          {suggestState === 'failed' && (
            <p className="text-xs text-orange-primary">
              <Bi en="Couldn't send — check your connection" zh="提交失败——请检查网络" />
            </p>
          )}
        </div>
      )}
    </form>
  );
};

export default CustomQuestionForm;
