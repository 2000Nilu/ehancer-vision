import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploaderProps {
  onImageUpload: (image: string) => void;
  customImage: string | null;
  onReset: () => void;
}

const ImageUploader = ({ onImageUpload, customImage, onReset }: ImageUploaderProps) => {
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-8">
      <Button variant="outline" className="relative">
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleImageUpload}
          accept="image/*"
        />
        <Upload className="mr-2" />
        Upload Your Image
      </Button>
      {customImage && (
        <Button
          variant="ghost"
          className="ml-4"
          onClick={onReset}
        >
          Reset to Demo Images
        </Button>
      )}
    </div>
  );
};

export default ImageUploader;