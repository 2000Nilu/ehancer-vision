import { useEffect, useRef, useState, useCallback } from "react";
import SliderControl from "./SliderControl";
import ImageOverlay from "./ImageOverlay";

interface ImagePreviewProps {
  beforeImage: string;
  afterImage: string;
}

const ImagePreview = ({ beforeImage, afterImage }: ImagePreviewProps) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const loadedImages = useRef({ before: false, after: false });
  const [error, setError] = useState(false);

  const handleImageLoad = useCallback((type: 'before' | 'after') => {
    loadedImages.current[type] = true;
    if (loadedImages.current.before && loadedImages.current.after) {
      setImagesLoaded(true);
      setError(false);
    }
  }, []);

  const handleImageError = useCallback(() => {
    setError(true);
    setImagesLoaded(false);
  }, []);

  useEffect(() => {
    loadedImages.current = { before: false, after: false };
    setImagesLoaded(false);
    setError(false);
  }, [beforeImage, afterImage]);

  if (error) {
    return (
      <div className="w-full aspect-[4/3] rounded-lg bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Failed to load image</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[4/3] rounded-lg overflow-hidden cursor-ew-resize touch-none transition-opacity duration-300 ${
        imagesLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <ImageOverlay
        position={position}
        image={beforeImage}
        alt="Before"
        onLoad={() => handleImageLoad('before')}
        onError={handleImageError}
      />
      <ImageOverlay
        position={position}
        image={afterImage}
        alt="After"
        isAfter
        onLoad={() => handleImageLoad('after')}
        onError={handleImageError}
      />
      <SliderControl
        position={position}
        onPositionChange={setPosition}
        containerRef={containerRef}
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