import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import {
  Moon,
  Sun,
  Monitor,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  RotateCcw,
  Edit2,
  Paintbrush,
  Info,
  Wand2
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ThemeDropdown } from '@/components/editor/theme-dropdown';
import { getRewriteModes, saveRewriteModes, resetRewriteModes, RewriteMode } from '@/lib/ai/rewriteModes';
import { toast } from 'sonner';

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultSidebarView?: 'tree' | 'outline' | 'split' | 'last-used';
  onDefaultSidebarViewChange?: (view: 'tree' | 'outline' | 'split' | 'last-used') => void;
}

const settingsNav = [
  { name: "Appearance", icon: Paintbrush },
  { name: "AI Rewrite Modes", icon: Wand2 },
  { name: "About", icon: Info },
];

export const Settings = ({ open, onOpenChange, defaultSidebarView = 'last-used', onDefaultSidebarViewChange }: SettingsProps) => {
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("Appearance");
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

  const renderContent = () => {
    switch (activeSection) {
      case "Appearance":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Appearance</h2>
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

            <Separator />

            <div className="space-y-4">
              <Label className="text-base">Default Sidebar View</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Choose the default view when opening the application
              </p>
              <RadioGroup
                value={defaultSidebarView}
                onValueChange={(value) => onDefaultSidebarViewChange?.(value as 'tree' | 'outline' | 'split' | 'last-used')}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="tree" id="tree" className="mt-1" />
                  <label htmlFor="tree" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Documents Tree</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Show only the document tree
                    </p>
                  </label>
                </div>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="outline" id="outline" className="mt-1" />
                  <label htmlFor="outline" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Outline Only</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Show only the headings outline
                    </p>
                  </label>
                </div>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="split" id="split" className="mt-1" />
                  <label htmlFor="split" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Split View</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Show both tree and outline side by side
                    </p>
                  </label>
                </div>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="last-used" id="last-used" className="mt-1" />
                  <label htmlFor="last-used" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Remember Last Used</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Use the view you had open last time
                    </p>
                  </label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case "AI Rewrite Modes":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">AI Rewrite Modes</h2>
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

            <Separator />

            <div className="space-y-3">
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
        );

      case "About":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-sm text-muted-foreground">
                Application information
              </p>
            </div>

            <Separator />

            <div className="text-sm space-y-3">
              <div className="space-y-1">
                <p className="font-medium">REASON</p>
                <p className="text-muted-foreground">A powerful note-taking application</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">Version</p>
                <p className="text-muted-foreground">1.0.0</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {settingsNav.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={item.name === activeSection}
                          onClick={() => setActiveSection(item.name)}
                        >
                          <a href="#">
                            <item.icon />
                            <span>{item.name}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">
                        <SettingsIcon className="h-4 w-4 inline mr-1" />
                        Settings
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{activeSection}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              {renderContent()}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
};
