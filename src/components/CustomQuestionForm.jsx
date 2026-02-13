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
      setFormData({ en: '', zh: '', category: 'getting_to_know' });
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
          className="rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          style={{ background: '#FFF8EB' /* Ivory */ }}
        >
          {/* Header */}
          <div 
            className="p-6"
            style={{
              borderBottom: '2px solid rgba(208, 183, 176, 0.3)',
              background: 'rgba(236, 182, 140, 0.1)'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 
                  className="text-2xl"
                  style={{
                    fontFamily: "'Caveat', cursive",
                    color: '#282828'
                  }}
                >
                  Add Your Own Question
                </h2>
                <p className="text-sm mt-1" style={{ color: '#656565', fontFamily: "'Ma Shan Zheng', 'Crimson Text', serif" }}>
                  添加你自己的问题
                </p>
              </div>
              <button
                onClick={onClose}
                className="transition-colors"
                style={{ color: '#656565' }}
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
              <label 
                className="block text-sm mb-2"
                style={{
                  fontFamily: "'Caveat', cursive",
                  color: '#282828'
                }}
              >
                Category / 类别
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-3 rounded-xl transition-colors duration-200"
                style={{
                  border: '2px solid rgba(208, 183, 176, 0.4)',
                  background: '#FFFFFF',
                  fontFamily: "'Caveat', cursive",
                  color: '#282828'
                }}
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
              <label 
                className="block text-sm mb-2"
                style={{
                  fontFamily: "'Caveat', cursive",
                  color: '#282828'
                }}
              >
                Question in English
              </label>
              <textarea
                value={formData.en}
                onChange={(e) => handleChange('en', e.target.value)}
                placeholder="Enter your question in English..."
                rows={3}
                required
                className="w-full px-4 py-3 rounded-xl resize-none transition-colors duration-200"
                style={{
                  border: '2px solid rgba(208, 183, 176, 0.4)',
                  background: '#FFFFFF',
                  color: '#282828'
                }}
              />
            </div>

            {/* Chinese Question */}
            <div>
              <label 
                className="block text-sm mb-2"
                style={{
                  fontFamily: "'Caveat', cursive",
                  color: '#282828'
                }}
              >
                Question in Chinese / 中文问题
              </label>
              <textarea
                value={formData.zh}
                onChange={(e) => handleChange('zh', e.target.value)}
                placeholder="输入你的中文问题..."
                rows={3}
                required
                className="w-full px-4 py-3 rounded-xl resize-none transition-colors duration-200"
                style={{
                  border: '2px solid rgba(208, 183, 176, 0.4)',
                  background: '#FFFFFF',
                  fontFamily: "'Ma Shan Zheng', 'Crimson Text', serif",
                  color: '#282828'
                }}
              />
            </div>

            {/* Info Note */}
            <div 
              className="rounded-xl p-4 text-sm"
              style={{
                background: 'rgba(236, 182, 140, 0.2)',
                color: '#656565'
              }}
            >
              <p style={{ fontFamily: "'Caveat', cursive" }} className="mb-1">Note:</p>
              <p>
                Custom questions will be available for this session only. 
                They will be reset when you refresh the page.
              </p>
              <p className="mt-2 text-xs" style={{ fontFamily: "'Ma Shan Zheng', 'Crimson Text', serif" }}>
                自定义问题仅在本次会话中可用，刷新页面后将重置。
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-full transition-colors duration-200"
                style={{
                  fontFamily: "'Caveat', cursive",
                  color: '#656565',
                  background: 'rgba(208, 183, 176, 0.2)'
                }}
              >
                Cancel / 取消
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-full transition-colors duration-200"
                style={{
                  fontFamily: "'Caveat', cursive",
                  background: '#4D7491', /* Blue */
                  color: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(77, 116, 145, 0.3)'
                }}
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
