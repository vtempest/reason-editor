import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface FontFamilyDropdownProps {
  editor: Editor;
}

const FONT_FAMILIES = [
  { name: 'Default', value: '' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
  { name: 'Impact', value: 'Impact, sans-serif' },
  { name: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
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
      <DropdownMenuContent align="start" className="w-48">
        {FONT_FAMILIES.map((font) => (
          <DropdownMenuItem
            key={font.name}
            onClick={() => setFontFamily(font.value)}
            style={{ fontFamily: font.value || undefined }}
            className="cursor-pointer"
          >
            {font.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
