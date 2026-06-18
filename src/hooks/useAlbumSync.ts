import { useState, useEffect, useRef, useCallback } from 'react';
import { type AlbumData } from '@/pages/AlbumPage';

const WS_URL = 'ws://localhost:8765';
const BASE_DELAY = 1000;
const MAX_DELAY = 30000;

export function useAlbumSync() {
  const [albumMap, setAlbumMap] = useState<Map<string, AlbumData>>(new Map());
  const wsRef = useRef<WebSocket | null>(null);
  const retryDelayRef = useRef(BASE_DELAY);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    if (!import.meta.env.DEV) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'album_update' && msg.albumKey && msg.data) {
          setAlbumMap((prev) => {
            const next = new Map(prev);
            next.set(msg.albumKey, msg.data as AlbumData);
            return next;
          });
        }
      } catch {
        // ignore malformed messages
      }
    };

    ws.onopen = () => {
      retryDelayRef.current = BASE_DELAY;
    };

    ws.onclose = () => {
      wsRef.current = null;
      const delay = retryDelayRef.current;
      retryDelayRef.current = Math.min(delay * 2, MAX_DELAY);
      timerRef.current = setTimeout(connect, delay);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect]);

  const getAlbumData = useCallback(
    (key: string): AlbumData | null => albumMap.get(key) ?? null,
    [albumMap]
  );

  return { getAlbumData };
}
