import React, { useEffect, useState } from 'react';
import { Bi } from '../i18n';
import { CloseIcon, ShareIcon } from './Icons';

const KEY_DISMISSED = 'truthcards:installHintDismissed';
const KEY_VISITS = 'truthcards:visits';

/**
 * iOS Safari hides "Add to Home Screen" — show a one-time tip from the
 * second visit onward, only on iOS in the browser (not when installed).
 */
const InstallHint = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
      if (!isIos || standalone || localStorage.getItem(KEY_DISMISSED)) return;
      const visits = (parseInt(localStorage.getItem(KEY_VISITS) || '0', 10) || 0) + 1;
      localStorage.setItem(KEY_VISITS, String(visits));
      if (visits >= 2) setShow(true);
    } catch {
      /* private mode */
    }
  }, []);

  if (!show) return null;

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(KEY_DISMISSED, '1');
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] md:bottom-6 md:left-auto md:right-6 md:max-w-sm z-40">
      <div className="bg-white rounded-2xl border-2 border-orange-primary/40 shadow-card p-3.5 flex items-start gap-3">
        <span className="w-9 h-9 shrink-0 rounded-xl bg-blue-primary/10 text-blue-primary flex items-center justify-center">
          <ShareIcon className="w-5 h-5" />
        </span>
        <p className="flex-1 text-sm text-ink leading-snug">
          <Bi
            en={'Install this app: tap Share, then "Add to Home Screen"'}
            zh={'安装到手机：点分享按钮，再选“添加到主屏幕”'}
            sep=" · "
          />
        </p>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="w-8 h-8 -mr-1 -mt-1 shrink-0 flex items-center justify-center text-gray-secondary"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default InstallHint;
