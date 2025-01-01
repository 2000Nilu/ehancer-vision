interface ImageOverlayProps {
  position: number;
  image: string;
  alt: string;
  isAfter?: boolean;
  onLoad: () => void;
  onError: () => void;
}

const ImageOverlay = ({ position, image, alt, isAfter, onLoad, onError }: ImageOverlayProps) => {
  return (
    <div
      className="absolute inset-0"
      style={
        isAfter
          ? {
              clipPath: `polygon(${position}% 0, 100% 0, 100% 100%, ${position}% 100%)`,
              willChange: 'clip-path',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              perspective: 1000,
              WebkitFontSmoothing: 'antialiased',
            }
          : {
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              perspective: 1000,
              WebkitFontSmoothing: 'antialiased',
            }
      }
    >
      <img
        src={image}
        alt={alt}
        className="w-full h-full object-cover"
        loading="eager"
        decoding="async"
        onLoad={onLoad}
        onError={onError}
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)',
          imageRendering: 'auto',
        }}
      />
    </div>
  );
};

export default ImageOverlay;