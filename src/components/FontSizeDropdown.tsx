import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface FontSizeDropdownProps {
  editor: Editor;
}

const FONT_SIZES = [
  { name: 'Default', value: '' },
  { name: '12px', value: '12px' },
  { name: '14px', value: '14px' },
  { name: '16px', value: '16px' },
  { name: '18px', value: '18px' },
  { name: '20px', value: '20px' },
  { name: '24px', value: '24px' },
  { name: '28px', value: '28px' },
  { name: '32px', value: '32px' },
  { name: '36px', value: '36px' },
  { name: '48px', value: '48px' },
];

export const FontSizeDropdown = ({ editor }: FontSizeDropdownProps) => {
  const getCurrentSize = () => {
    const currentSize = editor.getAttributes('textStyle').fontSize;
    if (!currentSize) return 'Default';
    const size = FONT_SIZES.find(s => s.value === currentSize);
    return size?.name || 'Default';
  };

  const setFontSize = (fontSize: string) => {
    if (fontSize === '') {
      editor.chain().focus().unsetFontSize().run();
    } else {
      editor.chain().focus().setFontSize(fontSize).run();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs min-w-[80px] justify-between"
          title="Font Size"
        >
          <span className="truncate">{getCurrentSize()}</span>
          <ChevronDown className="h-3 w-3 ml-1 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-32">
        {FONT_SIZES.map((size) => (
          <DropdownMenuItem
            key={size.name}
            onClick={() => setFontSize(size.value)}
            style={{ fontSize: size.value || undefined }}
            className="cursor-pointer"
          >
            {size.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
