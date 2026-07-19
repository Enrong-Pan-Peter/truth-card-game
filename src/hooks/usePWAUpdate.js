import { useEffect, useRef, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

/** Service-worker updates: show a toast instead of silently waiting for next launch. */
export function usePWAUpdate() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const updateRef = useRef(() => window.location.reload());

  useEffect(() => {
    try {
      const updateSW = registerSW({
        immediate: true,
        onNeedRefresh: () => setNeedRefresh(true),
      });
      updateRef.current = () => updateSW(true);
    } catch {
      /* SW unsupported (e.g. dev) */
    }
  }, []);

  return {
    needRefresh,
    applyUpdate: () => updateRef.current(),
    dismiss: () => setNeedRefresh(false),
  };
}
