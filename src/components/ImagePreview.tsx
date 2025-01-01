import { useEffect, useRef, useState, useCallback } from "react";

interface ImagePreviewProps {
  beforeImage: string;
  afterImage: string;
}

const ImagePreview = ({ beforeImage, afterImage }: ImagePreviewProps) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const rafRef = useRef<number>();
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const loadedImages = useRef({ before: false, after: false });

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current || !isDragging.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const newPosition = (x / rect.width) * 100;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      setPosition(Math.min(Math.max(newPosition, 0), 100));
    });
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX);
  }, [handleMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  useEffect(() => {
    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
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

  const handleImageLoad = (type: 'before' | 'after') => {
    loadedImages.current[type] = true;
    if (loadedImages.current.before && loadedImages.current.after) {
      setImagesLoaded(true);
    }
  };

  useEffect(() => {
    loadedImages.current = { before: false, after: false };
    setImagesLoaded(false);
  }, [beforeImage, afterImage]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[4/3] rounded-lg overflow-hidden cursor-ew-resize touch-none transition-opacity duration-300 ${
        imagesLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      onMouseDown={startDragging}
      onTouchStart={startDragging}
    >
      <div className="absolute inset-0">
        <img
          src={beforeImage}
          alt="Before"
          className="w-full h-full object-cover"
          loading="eager"
          onLoad={() => handleImageLoad('before')}
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          clipPath: `polygon(${position}% 0, 100% 0, 100% 100%, ${position}% 100%)`,
        }}
      >
        <img
          src={afterImage}
          alt="After"
          className="w-full h-full object-cover"
          loading="eager"
          onLoad={() => handleImageLoad('after')}
        />
      </div>
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
        style={{ left: `${position}%` }}
      />
      <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 text-white rounded-full text-sm">
        Before
      </div>
      <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 text-white rounded-full text-sm">
        After
      </div>
    </div>
  );
};

export default ImagePreview;