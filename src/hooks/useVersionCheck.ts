'use client';

import { useEffect, useState } from 'react';

const POLL_INTERVAL = 5 * 60 * 1000; // 5 分钟

export function useVersionCheck() {
  const [hasUpdate, setHasUpdate] = useState(false);

  useEffect(() => {
    let initialVersion: string | null = null;
    let timer: ReturnType<typeof setInterval>;

    async function fetchVersion(): Promise<string | null> {
      try {
        const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) return null;
        const data = await res.json();
        return data.version ?? null;
      } catch {
        return null;
      }
    }

    async function check() {
      const version = await fetchVersion();
      if (!version) return;

      if (initialVersion === null) {
        initialVersion = version;
      } else if (version !== initialVersion) {
        setHasUpdate(true);
        clearInterval(timer); // 已有更新，停止继续轮询
      }
    }

    check();
    timer = setInterval(check, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return hasUpdate;
}
