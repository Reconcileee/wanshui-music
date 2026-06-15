import { useRef, useCallback, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseDraggableOptions {
  initialPosition?: Position;
  boundaryPadding?: number;
  inertia?: boolean;
}

export function useDraggable<T extends HTMLElement>(options: UseDraggableOptions = {}) {
  const { initialPosition = { x: 0, y: 0 }, boundaryPadding = 16, inertia = true } = options;
  const ref = useRef<T>(null);
  const posRef = useRef<Position>({ ...initialPosition });
  const isDraggingRef = useRef(false);
  const startRef = useRef<Position>({ x: 0, y: 0 });
  const lastPosRef = useRef<Position>({ ...initialPosition });
  const lastTimeRef = useRef(0);
  const velocityRef = useRef<Position>({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const initialRef = useRef(initialPosition);
  initialRef.current = initialPosition;

  const applyInertia = useCallback(() => {
    if (!ref.current || isDraggingRef.current) return;

    const friction = 0.92;
    const stopThreshold = 0.5;

    velocityRef.current.x *= friction;
    velocityRef.current.y *= friction;

    const el = ref.current;
    const maxX = window.innerWidth - el.offsetWidth - boundaryPadding;
    const maxY = window.innerHeight - el.offsetHeight - boundaryPadding;

    posRef.current.x += velocityRef.current.x;
    posRef.current.y += velocityRef.current.y;

    // 边界碰撞反弹
    if (posRef.current.x < boundaryPadding) {
      posRef.current.x = boundaryPadding;
      velocityRef.current.x *= -0.3;
    }
    if (posRef.current.x > maxX) {
      posRef.current.x = maxX;
      velocityRef.current.x *= -0.3;
    }
    if (posRef.current.y < boundaryPadding) {
      posRef.current.y = boundaryPadding;
      velocityRef.current.y *= -0.3;
    }
    if (posRef.current.y > maxY) {
      posRef.current.y = maxY;
      velocityRef.current.y *= -0.3;
    }

    el.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;

    if (
      Math.abs(velocityRef.current.x) > stopThreshold ||
      Math.abs(velocityRef.current.y) > stopThreshold
    ) {
      rafRef.current = requestAnimationFrame(applyInertia);
    }
  }, [boundaryPadding]);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    if (!ref.current) return;
    isDraggingRef.current = true;
    cancelAnimationFrame(rafRef.current);
    startRef.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y,
    };
    lastPosRef.current = { ...posRef.current };
    lastTimeRef.current = performance.now();
    velocityRef.current = { x: 0, y: 0 };
    ref.current.setPointerCapture(e.pointerId);
    ref.current.style.cursor = 'grabbing';
    ref.current.style.transition = 'none';
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDraggingRef.current || !ref.current) return;
    const newX = e.clientX - startRef.current.x;
    const newY = e.clientY - startRef.current.y;

    const el = ref.current;
    const maxX = window.innerWidth - el.offsetWidth - boundaryPadding;
    const maxY = window.innerHeight - el.offsetHeight - boundaryPadding;

    posRef.current = {
      x: Math.max(boundaryPadding, Math.min(newX, maxX)),
      y: Math.max(boundaryPadding, Math.min(newY, maxY)),
    };

    // 计算速度
    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) {
      velocityRef.current = {
        x: (posRef.current.x - lastPosRef.current.x) / dt * 16,
        y: (posRef.current.y - lastPosRef.current.y) / dt * 16,
      };
    }
    lastPosRef.current = { ...posRef.current };
    lastTimeRef.current = now;

    el.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
  }, [boundaryPadding]);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (!ref.current) return;
    isDraggingRef.current = false;
    ref.current.releasePointerCapture(e.pointerId);
    ref.current.style.cursor = 'move';
    ref.current.style.transition = 'transform 0.2s cubic-bezier(0.32, 0.72, 0, 1)';

    if (inertia && (Math.abs(velocityRef.current.x) > 1 || Math.abs(velocityRef.current.y) > 1)) {
      ref.current.style.transition = 'none';
      rafRef.current = requestAnimationFrame(applyInertia);
    }
  }, [inertia, applyInertia]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const init = initialRef.current;
    el.style.transform = `translate(${init.x}px, ${init.y}px)`;
    posRef.current = { ...init };

    el.addEventListener('pointerdown', handlePointerDown);
    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerup', handlePointerUp);

    return () => {
      cancelAnimationFrame(rafRef.current);
      el.removeEventListener('pointerdown', handlePointerDown);
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp]);

  return ref;
}
