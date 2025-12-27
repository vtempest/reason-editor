import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Type, ChevronDown } from 'lucide-react';

interface StylesDropdownProps {
  editor: Editor;
}

const TEXT_STYLES = [
  { name: 'Bold', action: 'toggleBold', check: 'bold' },
  { name: 'Italic', action: 'toggleItalic', check: 'italic' },
  { name: 'Underline', action: 'toggleUnderline', check: 'underline' },
  { name: 'Strikethrough', action: 'toggleStrike', check: 'strike' },
  { name: 'Code', action: 'toggleCode', check: 'code' },
  { name: 'Highlight', action: 'toggleHighlight', check: 'highlight' },
];

const BLOCK_STYLES = [
  { name: 'Blockquote', action: 'toggleBlockquote', check: 'blockquote' },
  { name: 'Code Block', action: 'toggleCodeBlock', check: 'codeBlock' },
];

const LIST_STYLES = [
  { name: 'Bullet List', action: 'toggleBulletList', check: 'bulletList' },
  { name: 'Numbered List', action: 'toggleOrderedList', check: 'orderedList' },
  { name: 'Task List', action: 'toggleTaskList', check: 'taskList' },
];

export const StylesDropdown = ({ editor }: StylesDropdownProps) => {
  const applyStyle = (action: string) => {
    (editor.chain().focus() as any)[action]().run();
  };

  const isActive = (check: string) => {
    return editor.isActive(check);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 gap-1"
          title="Text Styles"
        >
          <Type className="h-4 w-4" />
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
          Text Formatting
        </div>
        {TEXT_STYLES.map((style) => (
          <DropdownMenuItem
            key={style.name}
            onClick={() => applyStyle(style.action)}
            className={`cursor-pointer ${isActive(style.check) ? 'bg-accent' : ''}`}
          >
            {style.name}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
          Block Styles
        </div>
        {BLOCK_STYLES.map((style) => (
          <DropdownMenuItem
            key={style.name}
            onClick={() => applyStyle(style.action)}
            className={`cursor-pointer ${isActive(style.check) ? 'bg-accent' : ''}`}
          >
            {style.name}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
          Lists
        </div>
        {LIST_STYLES.map((style) => (
          <DropdownMenuItem
            key={style.name}
            onClick={() => applyStyle(style.action)}
            className={`cursor-pointer ${isActive(style.check) ? 'bg-accent' : ''}`}
          >
            {style.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
