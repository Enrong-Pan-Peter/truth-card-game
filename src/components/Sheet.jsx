import React, { useEffect, useRef, useState } from 'react';
import { Bi } from '../i18n';
import { CloseIcon } from './Icons';

/**
 * Responsive panel: slides up as a bottom sheet on mobile (with drag-to-dismiss),
 * slides in from the right as a side panel on desktop.
 */
const Sheet = ({ open, onClose, titleEn, titleZh, children, footer }) => {
  const [dragY, setDragY] = useState(0);
  const startY = useRef(null);

  useEffect(() => {
    if (!open) {
      setDragY(0);
      startY.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const onTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
  };
  const onTouchMove = (e) => {
    if (startY.current == null) return;
    setDragY(Math.max(0, e.touches[0].clientY - startY.current));
  };
  const onTouchEnd = () => {
    if (dragY > 80) onClose();
    setDragY(0);
    startY.current = null;
  };
  const dragHandlers = { onTouchStart, onTouchMove, onTouchEnd };

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/25 z-40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed z-50 bg-white shadow-2xl flex flex-col
          inset-x-0 bottom-0 rounded-t-3xl max-h-[82dvh]
          md:inset-y-0 md:right-0 md:left-auto md:bottom-auto md:h-full md:w-96 md:max-h-none md:rounded-none
          ${dragY ? '' : 'transition-transform duration-300 ease-out'}
          ${open ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}`}
        style={dragY ? { transform: `translateY(${dragY}px)` } : undefined}
      >
        {/* Drag handle (mobile only) */}
        <div className="md:hidden pt-3 pb-1 flex justify-center touch-none" {...dragHandlers}>
          <div className="w-10 h-1.5 rounded-full bg-pale-pink/60" />
        </div>

        <div
          className="px-5 pb-3 pt-1 md:pt-5 flex items-center justify-between border-b-2 border-pale-pink/20"
          {...dragHandlers}
        >
          <h2 className="text-xl text-ink">
            <Bi en={titleEn} zh={titleZh} />
          </h2>
          <button
            onClick={onClose}
            className="w-11 h-11 -mr-2 flex items-center justify-center text-gray-secondary hover:text-ink"
            aria-label="Close"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">{children}</div>

        {footer ? (
          <div className="px-5 pt-3 border-t-2 border-pale-pink/20 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:pb-3">
            {footer}
          </div>
        ) : (
          <div className="pb-[env(safe-area-inset-bottom)] md:pb-0" />
        )}
      </div>
    </>
  );
};

export default Sheet;
