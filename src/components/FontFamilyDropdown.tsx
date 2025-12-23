import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface FontFamilyDropdownProps {
  editor: Editor;
}

const FONT_FAMILIES = [
  { name: 'Default', value: '', category: 'System' },
  // Google Fonts - Sans Serif
  { name: 'Inter', value: 'var(--font-inter), sans-serif', category: 'Sans Serif' },
  { name: 'Roboto', value: 'var(--font-roboto), sans-serif', category: 'Sans Serif' },
  { name: 'Open Sans', value: 'var(--font-open-sans), sans-serif', category: 'Sans Serif' },
  { name: 'Lato', value: 'var(--font-lato), sans-serif', category: 'Sans Serif' },
  { name: 'Montserrat', value: 'var(--font-montserrat), sans-serif', category: 'Sans Serif' },
  { name: 'Poppins', value: 'var(--font-poppins), sans-serif', category: 'Sans Serif' },
  { name: 'Nunito', value: 'var(--font-nunito), sans-serif', category: 'Sans Serif' },
  { name: 'Raleway', value: 'var(--font-raleway), sans-serif', category: 'Sans Serif' },
  { name: 'Ubuntu', value: 'var(--font-ubuntu), sans-serif', category: 'Sans Serif' },
  { name: 'Oswald', value: 'var(--font-oswald), sans-serif', category: 'Sans Serif' },
  // Google Fonts - Serif
  { name: 'Playfair Display', value: 'var(--font-playfair), serif', category: 'Serif' },
  { name: 'Merriweather', value: 'var(--font-merriweather), serif', category: 'Serif' },
  { name: 'Lora', value: 'var(--font-lora), serif', category: 'Serif' },
  { name: 'PT Serif', value: 'var(--font-pt-serif), serif', category: 'Serif' },
  // Google Fonts - Monospace
  { name: 'Fira Code', value: 'var(--font-fira-code), monospace', category: 'Monospace' },
  { name: 'Source Code Pro', value: 'var(--font-source-code-pro), monospace', category: 'Monospace' },
  { name: 'Inconsolata', value: 'var(--font-inconsolata), monospace', category: 'Monospace' },
  // System Fonts
  { name: 'Arial', value: 'Arial, sans-serif', category: 'System' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif', category: 'System' },
  { name: 'Verdana', value: 'Verdana, sans-serif', category: 'System' },
  { name: 'Times New Roman', value: 'Times New Roman, serif', category: 'System' },
  { name: 'Georgia', value: 'Georgia, serif', category: 'System' },
  { name: 'Courier New', value: 'Courier New, monospace', category: 'System' },
];

export const FontFamilyDropdown = ({ editor }: FontFamilyDropdownProps) => {
  const getCurrentFont = () => {
    const currentFont = editor.getAttributes('textStyle').fontFamily;
    if (!currentFont) return 'Default';
    const font = FONT_FAMILIES.find(f => f.value === currentFont);
    return font?.name || 'Default';
  };

  const setFontFamily = (fontFamily: string) => {
    if (fontFamily === '') {
      editor.chain().focus().unsetFontFamily().run();
    } else {
      editor.chain().focus().setFontFamily(fontFamily).run();
    }
  };

  // Group fonts by category
  const fontsByCategory = FONT_FAMILIES.reduce((acc, font) => {
    if (!acc[font.category]) {
      acc[font.category] = [];
    }
    acc[font.category].push(font);
    return acc;
  }, {} as Record<string, typeof FONT_FAMILIES>);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs min-w-[100px] justify-between"
          title="Font Family"
        >
          <span className="truncate">{getCurrentFont()}</span>
          <ChevronDown className="h-3 w-3 ml-1 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 max-h-[400px] overflow-y-auto">
        {/* System/Default */}
        {fontsByCategory['System']?.filter(f => f.name === 'Default').map((font) => (
          <DropdownMenuItem
            key={font.name}
            onClick={() => setFontFamily(font.value)}
            className="cursor-pointer"
          >
            {font.name}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs">Sans Serif</DropdownMenuLabel>
        {fontsByCategory['Sans Serif']?.map((font) => (
          <DropdownMenuItem
            key={font.name}
            onClick={() => setFontFamily(font.value)}
            style={{ fontFamily: font.value }}
            className="cursor-pointer"
          >
            {font.name}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs">Serif</DropdownMenuLabel>
        {fontsByCategory['Serif']?.map((font) => (
          <DropdownMenuItem
            key={font.name}
            onClick={() => setFontFamily(font.value)}
            style={{ fontFamily: font.value }}
            className="cursor-pointer"
          >
            {font.name}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs">Monospace</DropdownMenuLabel>
        {fontsByCategory['Monospace']?.map((font) => (
          <DropdownMenuItem
            key={font.name}
            onClick={() => setFontFamily(font.value)}
            style={{ fontFamily: font.value }}
            className="cursor-pointer"
          >
            {font.name}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs">System Fonts</DropdownMenuLabel>
        {fontsByCategory['System']?.filter(f => f.name !== 'Default').map((font) => (
          <DropdownMenuItem
            key={font.name}
            onClick={() => setFontFamily(font.value)}
            style={{ fontFamily: font.value }}
            className="cursor-pointer"
          >
            {font.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
