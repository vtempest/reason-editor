import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FloatingSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onFocus?: () => void;
  className?: string;
}

export const FloatingSearch = ({ value, onChange, onClear, onFocus, className }: FloatingSearchProps) => {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
      <Input
        type="text"
        placeholder="Search notes... (Ctrl+K)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        className="pl-9 pr-9 bg-sidebar-accent/80 backdrop-blur-sm border-sidebar-border focus-visible:ring-sidebar-ring shadow-lg"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 z-10"
          onClick={onClear}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};
