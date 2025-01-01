import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ImageType {
  id: string;
  name: string;
  image: string;
}

const imageTypes: ImageType[] = [
  {
    id: "portrait",
    name: "Portrait",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80&auto=format",
  },
  {
    id: "landscape",
    name: "Landscape",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&q=80&auto=format",
  },
  {
    id: "oldphoto",
    name: "Old Photo",
    image: "https://images.unsplash.com/photo-1552168324-d612d77725e3?w=200&q=80&auto=format",
  },
];

interface ImageTypeSelectorProps {
  selectedType: string;
  onSelect: (type: string) => void;
}

const ImageTypeSelector = ({ selectedType, onSelect }: ImageTypeSelectorProps) => {
  return (
    <div className="flex gap-4 mb-8">
      {imageTypes.map((type) => (
        <Card
          key={type.id}
          className={cn(
            "w-32 cursor-pointer transition-all hover:scale-105",
            selectedType === type.id && "ring-2 ring-primary"
          )}
          onClick={() => onSelect(type.id)}
        >
          <CardContent className="p-2">
            <div className="aspect-square rounded-lg overflow-hidden mb-2">
              <img
                src={type.image}
                alt={type.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="text-center text-sm font-medium">{type.name}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ImageTypeSelector;