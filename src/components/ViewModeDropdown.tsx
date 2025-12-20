import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Eye, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewMode = 'formatted' | 'html' | 'markdown';

interface ViewModeDropdownProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export const ViewModeDropdown = ({ value, onChange }: ViewModeDropdownProps) => {
  const getLabel = (mode: ViewMode) => {
    switch (mode) {
      case 'formatted':
        return 'Formatted text';
      case 'html':
        return 'HTML';
      case 'markdown':
        return 'Markdown';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2" title="View mode">
          <Eye className="h-4 w-4" />
          <span className="text-sm">{getLabel(value)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => onChange('formatted')}>
          <Check className={cn('mr-2 h-4 w-4', value !== 'formatted' && 'opacity-0')} />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange('html')}>
          <Check className={cn('mr-2 h-4 w-4', value !== 'html' && 'opacity-0')} />
          HTML
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange('markdown')}>
          <Check className={cn('mr-2 h-4 w-4', value !== 'markdown' && 'opacity-0')} />
          Markdown
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
