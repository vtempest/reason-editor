import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, ChevronDown } from 'lucide-react';

interface AlignmentDropdownProps {
  editor: Editor;
}

const ALIGNMENTS = [
  { name: 'Left', value: 'left', icon: AlignLeft },
  { name: 'Center', value: 'center', icon: AlignCenter },
  { name: 'Right', value: 'right', icon: AlignRight },
  { name: 'Justify', value: 'justify', icon: AlignJustify },
];

export const AlignmentDropdown = ({ editor }: AlignmentDropdownProps) => {
  const getCurrentAlignment = () => {
    for (const align of ALIGNMENTS) {
      if (editor.isActive({ textAlign: align.value })) {
        return align;
      }
    }
    return ALIGNMENTS[0]; // Default to left
  };

  const setAlignment = (alignment: string) => {
    editor.chain().focus().setTextAlign(alignment).run();
  };

  const currentAlignment = getCurrentAlignment();
  const CurrentIcon = currentAlignment.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 gap-1"
          title="Text Alignment"
        >
          <CurrentIcon className="h-4 w-4" />
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        {ALIGNMENTS.map((align) => {
          const Icon = align.icon;
          return (
            <DropdownMenuItem
              key={align.value}
              onClick={() => setAlignment(align.value)}
              className="cursor-pointer flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {align.name}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
