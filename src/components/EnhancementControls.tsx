import { Switch } from "@/components/ui/switch";
import { Info, RefreshCcw, Sun, Users, Users2 } from "lucide-react";

interface Enhancement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const enhancements: Enhancement[] = [
  {
    id: "face-enhance",
    name: "Face Enhance",
    description: "Increase quality of faces",
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: "face-glow",
    name: "Face Glow",
    description: "Give to people a new look and feel",
    icon: <RefreshCcw className="w-5 h-5" />,
  },
  {
    id: "auto-color",
    name: "Auto Color",
    description: "Adjust and improve colors and tones",
    icon: <Sun className="w-5 h-5" />,
  },
  {
    id: "background-enhance",
    name: "Background Enhance",
    description: "Increase the quality of every detail",
    icon: <Users2 className="w-5 h-5" />,
  },
];

interface EnhancementControlsProps {
  activeEnhancements: string[];
  onToggle: (enhancementId: string) => void;
}

const EnhancementControls = ({
  activeEnhancements,
  onToggle,
}: EnhancementControlsProps) => {
  return (
    <div className="space-y-4">
      {enhancements.map((enhancement) => (
        <div
          key={enhancement.id}
          className="flex items-center justify-between p-4 rounded-lg bg-card"
        >
          <div className="flex items-center gap-3">
            {enhancement.icon}
            <div>
              <h3 className="font-medium">{enhancement.name}</h3>
              <p className="text-sm text-muted-foreground">
                {enhancement.description}
              </p>
            </div>
          </div>
          <Switch
            checked={activeEnhancements.includes(enhancement.id)}
            onCheckedChange={() => onToggle(enhancement.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default EnhancementControls;