import { useCallback, useRef, useEffect } from 'react';

interface SliderControlProps {
  position: number;
  onPositionChange: (position: number) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const SliderControl = ({ position, onPositionChange, containerRef }: SliderControlProps) => {
  const isDragging = useRef(false);
  const rafRef = useRef<number>();
  const lastPosition = useRef(position);
  const lastClientX = useRef<number | null>(null);
  const lastUpdateTime = useRef(performance.now());
  const throttleDelay = 1000 / 120; // 120fps max update rate

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current || !isDragging.current) return;
    
    const currentTime = performance.now();
    if (currentTime - lastUpdateTime.current < throttleDelay) {
      return;
    }
    
    if (lastClientX.current !== null && Math.abs(clientX - lastClientX.current) < 0.1) {
      return;
    }
    lastClientX.current = clientX;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const newPosition = (x / rect.width) * 100;

    if (Math.abs(lastPosition.current - newPosition) > 0.01) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const clampedPosition = Math.min(Math.max(newPosition, 0), 100);
        lastPosition.current = clampedPosition;
        lastUpdateTime.current = currentTime;
        onPositionChange(clampedPosition);
      });
    }
  }, [onPositionChange, containerRef, throttleDelay]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX);
  }, [handleMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  useEffect(() => {
    const stopDragging = () => {
      isDragging.current = false;
      lastClientX.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
    };

    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchend', stopDragging);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      document.removeEventListener('mouseup', stopDragging);
      document.removeEventListener('touchend', stopDragging);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleMouseMove, handleTouchMove]);

  const startDragging = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
  };

  return (
    <div
      className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize transform -translate-x-1/2 hover:w-2 transition-all"
      style={{ 
        left: `${position}%`,
        willChange: 'left, transform',
        transform: 'translateX(-50%) translateZ(0)',
        backfaceVisibility: 'hidden',
        perspective: 1000,
        WebkitFontSmoothing: 'antialiased',
      }}
      onMouseDown={startDragging}
      onTouchStart={startDragging}
    />
  );
};

export default SliderControl;