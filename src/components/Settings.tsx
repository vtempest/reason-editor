import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor, Settings as SettingsIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const Settings = ({ open, onOpenChange }: SettingsProps) => {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      value: 'light',
      label: 'Light',
      icon: <Sun className="h-4 w-4" />,
      description: 'Clean and bright interface',
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: <Moon className="h-4 w-4" />,
      description: 'Easy on the eyes in low light',
    },
    {
      value: 'system',
      label: 'System',
      icon: <Monitor className="h-4 w-4" />,
      description: 'Sync with your system preferences',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            <DialogTitle>Settings</DialogTitle>
          </div>
          <DialogDescription>
            Customize your note-taking experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Appearance</h3>
              <p className="text-sm text-muted-foreground">
                Choose how Yana looks to you
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label className="text-base">Theme</Label>
              <RadioGroup
                value={theme}
                onValueChange={setTheme}
                className="space-y-3"
              >
                {themes.map((themeOption) => (
                  <div
                    key={themeOption.value}
                    className="flex items-start space-x-3"
                  >
                    <RadioGroupItem
                      value={themeOption.value}
                      id={themeOption.value}
                      className="mt-1"
                    />
                    <label
                      htmlFor={themeOption.value}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-muted-foreground">
                          {themeOption.icon}
                        </div>
                        <span className="font-medium">{themeOption.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {themeOption.description}
                      </p>
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">About</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Yana - A powerful note-taking application</p>
              <p>Version 1.0.0</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
