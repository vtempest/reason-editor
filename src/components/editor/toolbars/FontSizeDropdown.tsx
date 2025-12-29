import { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
  const [customSize, setCustomSize] = useState('');

  const getCurrentSize = () => {
    const currentSize = editor.getAttributes('textStyle').fontSize;
    if (!currentSize) return 'Default';
    const size = FONT_SIZES.find(s => s.value === currentSize);
    return size?.name || currentSize;
  };

  const getCurrentSizeValue = () => {
    const currentSize = editor.getAttributes('textStyle').fontSize;
    if (!currentSize) return 16;
    return parseInt(currentSize) || 16;
  };

  const setFontSize = (fontSize: string) => {
    if (fontSize === '') {
      editor.chain().focus().unsetFontSize().run();
    } else {
      editor.chain().focus().setFontSize(fontSize).run();
    }
  };

  const handleCustomSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomSize(value);
  };

  const handleCustomSizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const size = parseInt(customSize);
    if (!isNaN(size) && size > 0) {
      setFontSize(`${size}px`);
      setCustomSize('');
    }
  };

  const incrementSize = () => {
    const currentSize = getCurrentSizeValue();
    setFontSize(`${currentSize + 1}px`);
  };

  const decrementSize = () => {
    const currentSize = getCurrentSizeValue();
    if (currentSize > 1) {
      setFontSize(`${currentSize - 1}px`);
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
      <DropdownMenuContent align="start" className="w-48 p-2">
        <div className="flex items-center gap-1 mb-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={decrementSize}
            title="Decrease font size"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <form onSubmit={handleCustomSizeSubmit} className="flex-1">
            <Input
              type="number"
              min="1"
              max="200"
              placeholder="Custom size"
              value={customSize}
              onChange={handleCustomSizeChange}
              className="h-7 text-xs"
            />
          </form>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={incrementSize}
            title="Increase font size"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <DropdownMenuSeparator />
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
