import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface HeadingsDropdownProps {
  editor: Editor;
}

const HEADINGS = [
  { name: 'Paragraph', level: 0 },
  { name: 'Heading 1', level: 1 },
  { name: 'Heading 2', level: 2 },
  { name: 'Heading 3', level: 3 },
  { name: 'Heading 4', level: 4 },
  { name: 'Heading 5', level: 5 },
  { name: 'Heading 6', level: 6 },
];

export const HeadingsDropdown = ({ editor }: HeadingsDropdownProps) => {
  const getCurrentHeading = () => {
    for (const heading of HEADINGS) {
      if (heading.level === 0) {
        if (editor.isActive('paragraph')) {
          return heading;
        }
      } else if (editor.isActive('heading', { level: heading.level })) {
        return heading;
      }
    }
    return HEADINGS[0]; // Default to paragraph
  };

  const setHeading = (level: number) => {
    if (level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
    }
  };

  const currentHeading = getCurrentHeading();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs min-w-[100px] justify-between"
          title="Heading Level"
        >
          <span className="truncate">{currentHeading.name}</span>
          <ChevronDown className="h-3 w-3 ml-1 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        {HEADINGS.map((heading) => (
          <DropdownMenuItem
            key={heading.level}
            onClick={() => setHeading(heading.level)}
            className="cursor-pointer"
          >
            {heading.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
