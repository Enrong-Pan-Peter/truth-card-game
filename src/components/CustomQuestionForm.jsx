import React, { useState } from 'react';
import { getCategoryDisplay } from '../utils/gameUtils';

const CustomQuestionForm = ({ isOpen, onClose, onAddQuestion }) => {
  const [formData, setFormData] = useState({
    en: '',
    zh: '',
    category: 'getting_to_know'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.en.trim() && formData.zh.trim()) {
      onAddQuestion(formData);
      setFormData({ en: '', zh: '', category: 'childhood' });
      onClose();
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-warm-cream rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b-2 border-warm-brown-light/20 bg-warm-sand/30">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display text-warm-brown-dark">
                  Add Your Own Question
                </h2>
                <p className="text-sm text-warm-brown/70 mt-1">
                  添加你自己的问题
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-warm-brown hover:text-warm-brown-dark transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-display text-warm-brown-dark mb-2">
                Category / 类别
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-warm-brown-light/30 bg-white focus:border-warm-coral focus:outline-none transition-colors duration-200 font-display"
              >
                <option value="getting_to_know">
                  {getCategoryDisplay('getting_to_know').en} / {getCategoryDisplay('getting_to_know').zh}
                </option>
                <option value="ideals_reals">
                  {getCategoryDisplay('ideals_reals').en} / {getCategoryDisplay('ideals_reals').zh}
                </option>
                <option value="heart_to_heart">
                  {getCategoryDisplay('heart_to_heart').en} / {getCategoryDisplay('heart_to_heart').zh}
                </option>
                <option value="memories">
                  {getCategoryDisplay('memories').en} / {getCategoryDisplay('memories').zh}
                </option>
                <option value="matters_of_soul">
                  {getCategoryDisplay('matters_of_soul').en} / {getCategoryDisplay('matters_of_soul').zh}
                </option>
              </select>
            </div>

            {/* English Question */}
            <div>
              <label className="block text-sm font-display text-warm-brown-dark mb-2">
                Question in English
              </label>
              <textarea
                value={formData.en}
                onChange={(e) => handleChange('en', e.target.value)}
                placeholder="Enter your question in English..."
                rows={3}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-warm-brown-light/30 bg-white focus:border-warm-coral focus:outline-none transition-colors duration-200 resize-none"
              />
            </div>

            {/* Chinese Question */}
            <div>
              <label className="block text-sm font-display text-warm-brown-dark mb-2">
                Question in Chinese / 中文问题
              </label>
              <textarea
                value={formData.zh}
                onChange={(e) => handleChange('zh', e.target.value)}
                placeholder="输入你的中文问题..."
                rows={3}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-warm-brown-light/30 bg-white focus:border-warm-coral focus:outline-none transition-colors duration-200 resize-none"
              />
            </div>

            {/* Info Note */}
            <div className="bg-warm-peach/20 rounded-xl p-4 text-sm text-warm-brown/80">
              <p className="font-display mb-1">Note:</p>
              <p>
                Custom questions will be available for this session only. 
                They will be reset when you refresh the page.
              </p>
              <p className="mt-2 text-xs">
                自定义问题仅在本次会话中可用，刷新页面后将重置。
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-full font-display text-warm-brown-dark hover:bg-warm-brown-light/10 transition-colors duration-200"
              >
                Cancel / 取消
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-full font-display bg-warm-coral text-white hover:bg-warm-coral/90 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Add Question / 添加问题
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CustomQuestionForm;
