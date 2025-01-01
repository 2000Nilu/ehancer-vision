import { useState, useMemo, useCallback } from "react";
import ImageTypeSelector from "@/components/ImageTypeSelector";
import EnhancementControls from "@/components/EnhancementControls";
import ImagePreview from "@/components/ImagePreview";
import ImageUploader from "@/components/ImageUploader";
import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import { constructImageUrl, getDefaultImages } from "@/utils/imageProcessing";

const Index = () => {
  const [selectedType, setSelectedType] = useState("portrait");
  const [activeEnhancements, setActiveEnhancements] = useState<string[]>(["face-enhance"]);
  const [customImage, setCustomImage] = useState<string | null>(null);

  const handleEnhancementToggle = useCallback((enhancementId: string) => {
    setActiveEnhancements((current) =>
      current.includes(enhancementId)
        ? current.filter((id) => id !== enhancementId)
        : [...current, enhancementId]
    );
  }, []);

  const images = useMemo(() => {
    if (customImage) {
      return {
        after: customImage,
        before: constructImageUrl(customImage, selectedType, activeEnhancements),
      };
    }
    const defaultImages = getDefaultImages(selectedType);
    return {
      after: defaultImages.after,
      before: constructImageUrl(defaultImages.before, selectedType, activeEnhancements),
    };
  }, [selectedType, activeEnhancements, customImage]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex justify-between items-center mb-8">
        <Logo />
        <ThemeToggle />
      </div>
      <div className="max-w-4xl mx-auto">
        <ImageUploader
          onImageUpload={setCustomImage}
          customImage={customImage}
          onReset={() => setCustomImage(null)}
        />

        {!customImage && (
          <ImageTypeSelector
            selectedType={selectedType}
            onSelect={setSelectedType}
          />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImagePreview
            beforeImage={images.before}
            afterImage={images.after}
          />
          
          <EnhancementControls
            activeEnhancements={activeEnhancements}
            onToggle={handleEnhancementToggle}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;