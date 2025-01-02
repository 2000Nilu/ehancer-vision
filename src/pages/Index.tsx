import { useState, useMemo, useCallback } from "react";
import ImageTypeSelector from "@/components/ImageTypeSelector";
import EnhancementControls from "@/components/EnhancementControls";
import ImagePreview from "@/components/ImagePreview";
import ImageUploader from "@/components/ImageUploader";
import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import { constructImageUrl, getDefaultImages } from "@/utils/imageProcessing";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [selectedType, setSelectedType] = useState("portrait");
  const [activeEnhancements, setActiveEnhancements] = useState<string[]>(["face-enhance"]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("GFPGAN");
  const { toast } = useToast();

  const handleEnhancementToggle = useCallback((enhancementId: string) => {
    setActiveEnhancements((current) =>
      current.includes(enhancementId)
        ? current.filter((id) => id !== enhancementId)
        : [...current, enhancementId]
    );
  }, []);

  const handleModelChange = useCallback((model: string) => {
    setSelectedModel(model);
    // Adjust active enhancements based on model
    if (model === "GFPGAN") {
      setActiveEnhancements(["face-enhance"]);
    } else {
      setActiveEnhancements(["background-enhance"]);
    }
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

  const handleImageEnhancement = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to enhance images",
          variant: "destructive",
        });
        return;
      }

      const response = await supabase.functions.invoke("enhance-image", {
        body: {
          imageUrl: images.before,
          modelType: selectedModel,
          userId: user.id,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: "Enhancement started",
        description: "Your image is being processed. This may take a few minutes.",
      });

      // Start polling for status
      const checkStatus = async () => {
        const statusResponse = await supabase.functions.invoke("check-enhancement", {
          body: { enhancementId: response.data.enhancementId },
        });

        if (statusResponse.data.status === "succeeded") {
          setCustomImage(statusResponse.data.output);
          toast({
            title: "Enhancement complete",
            description: "Your image has been successfully enhanced!",
          });
        } else if (statusResponse.data.status === "failed") {
          toast({
            title: "Enhancement failed",
            description: "There was an error processing your image.",
            variant: "destructive",
          });
        } else {
          // Continue polling
          setTimeout(checkStatus, 5000);
        }
      };

      checkStatus();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;