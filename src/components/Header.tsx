import { Menu, Search as SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
}

export const Header = ({ onMenuClick, onSearchClick }: HeaderProps) => {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={onMenuClick}
        className="h-9 w-9 p-0"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <h1 className="font-serif text-lg font-semibold">Yana</h1>

      <Button
        variant="ghost"
        size="sm"
        onClick={onSearchClick}
        className="h-9 w-9 p-0"
      >
        <SearchIcon className="h-5 w-5" />
      </Button>
    </header>
  );
};
