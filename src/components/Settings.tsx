import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { Moon, Sun, Monitor, Settings as SettingsIcon, Plus, Trash2, RotateCcw, Edit2 } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ThemeDropdown } from '@/components/theme-dropdown';
import { getRewriteModes, saveRewriteModes, resetRewriteModes, RewriteMode } from '@/lib/ai/rewriteModes';
import { toast } from 'sonner';

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const Settings = ({ open, onOpenChange }: SettingsProps) => {
  const { theme, setTheme } = useTheme();
  const [rewriteModes, setRewriteModes] = useState<RewriteMode[]>([]);
  const [editingMode, setEditingMode] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<RewriteMode>>({});

  useEffect(() => {
    if (open) {
      setRewriteModes(getRewriteModes());
    }
  }, [open]);

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

  const handleSaveMode = (mode: RewriteMode) => {
    const updatedModes = rewriteModes.map((m) =>
      m.id === mode.id ? mode : m
    );
    setRewriteModes(updatedModes);
    saveRewriteModes(updatedModes);
    setEditingMode(null);
    setEditForm({});
    toast.success('Mode updated');
  };

  const handleAddMode = () => {
    const newMode: RewriteMode = {
      id: `custom-${Date.now()}`,
      name: editForm.name || 'New Mode',
      prompt: editForm.prompt || 'Rewrite this text:',
      color: editForm.color || 'blue',
    };
    const updatedModes = [...rewriteModes, newMode];
    setRewriteModes(updatedModes);
    saveRewriteModes(updatedModes);
    setEditingMode(null);
    setEditForm({});
    toast.success('Mode added');
  };

  const handleDeleteMode = (id: string) => {
    const updatedModes = rewriteModes.filter((m) => m.id !== id);
    setRewriteModes(updatedModes);
    saveRewriteModes(updatedModes);
    toast.success('Mode deleted');
  };

  const handleResetModes = () => {
    resetRewriteModes();
    setRewriteModes(getRewriteModes());
    toast.success('Modes reset to defaults');
  };

  const startEditing = (mode: RewriteMode) => {
    setEditingMode(mode.id);
    setEditForm(mode);
  };

  const cancelEditing = () => {
    setEditingMode(null);
    setEditForm({});
  };

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
                Choose how REASON looks to you
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

            <div className="space-y-4">
              <Label className="text-base">Color Theme</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Choose from various color themes to customize your interface
              </p>
              <div className="flex items-center">
                <ThemeDropdown />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">AI Rewrite Modes</h3>
                <p className="text-sm text-muted-foreground">
                  Customize AI rewrite prompts and add your own modes
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetModes}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {rewriteModes.map((mode) => (
                <div
                  key={mode.id}
                  className="border rounded-lg p-3 space-y-2"
                >
                  {editingMode === mode.id ? (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${mode.id}`}>Mode Name</Label>
                        <Input
                          id={`name-${mode.id}`}
                          value={editForm.name || ''}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          placeholder="Mode name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`prompt-${mode.id}`}>Prompt</Label>
                        <Textarea
                          id={`prompt-${mode.id}`}
                          value={editForm.prompt || ''}
                          onChange={(e) =>
                            setEditForm({ ...editForm, prompt: e.target.value })
                          }
                          placeholder="Rewrite prompt..."
                          rows={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`color-${mode.id}`}>Color</Label>
                        <select
                          id={`color-${mode.id}`}
                          value={editForm.color || 'blue'}
                          onChange={(e) =>
                            setEditForm({ ...editForm, color: e.target.value })
                          }
                          className="w-full border rounded-md px-3 py-2 text-sm"
                        >
                          <option value="blue">Blue</option>
                          <option value="purple">Purple</option>
                          <option value="green">Green</option>
                          <option value="orange">Orange</option>
                          <option value="pink">Pink</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveMode(editForm as RewriteMode)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-sm">
                          {mode.name}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => startEditing(mode)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-destructive"
                            onClick={() => handleDeleteMode(mode.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {mode.prompt}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {editingMode === 'new' && (
                <div className="border rounded-lg p-3 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="new-name">Mode Name</Label>
                    <Input
                      id="new-name"
                      value={editForm.name || ''}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      placeholder="Mode name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-prompt">Prompt</Label>
                    <Textarea
                      id="new-prompt"
                      value={editForm.prompt || ''}
                      onChange={(e) =>
                        setEditForm({ ...editForm, prompt: e.target.value })
                      }
                      placeholder="Rewrite prompt..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-color">Color</Label>
                    <select
                      id="new-color"
                      value={editForm.color || 'blue'}
                      onChange={(e) =>
                        setEditForm({ ...editForm, color: e.target.value })
                      }
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    >
                      <option value="blue">Blue</option>
                      <option value="purple">Purple</option>
                      <option value="green">Green</option>
                      <option value="orange">Orange</option>
                      <option value="pink">Pink</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddMode}>
                      Add Mode
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {editingMode !== 'new' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingMode('new');
                  setEditForm({ name: '', prompt: '', color: 'blue' });
                }}
                className="w-full gap-2"
              >
                <Plus className="h-4 w-4" />
                Add New Mode
              </Button>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">About</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>REASON - A powerful note-taking application</p>
              <p>Version 1.0.0</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
