import { Menu, Search as SearchIcon, Settings, Share2, MoreHorizontal, Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
  onSettingsClick: () => void;
  onShareClick?: () => void;
  documentTitle?: string;
}

export const Header = ({ onMenuClick, onSearchClick, onSettingsClick, onShareClick, documentTitle }: HeaderProps) => {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      {/* Left section - Mobile menu + breadcrumb */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="h-9 w-9 p-0 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Desktop breadcrumb */}
        <div className="hidden lg:flex items-center gap-1 text-sm text-muted-foreground min-w-0">
          <span className="font-serif font-semibold text-foreground">Yana</span>
          {documentTitle && (
            <>
              <ChevronRight className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{documentTitle}</span>
            </>
          )}
        </div>

        {/* Mobile title */}
        <h1 className="font-serif text-lg font-semibold lg:hidden truncate">Yana</h1>
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center gap-2">
        {/* Desktop avatars */}
        <div className="hidden lg:flex items-center -space-x-2">
          <Avatar className="h-8 w-8 border-2 border-background">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">JD</AvatarFallback>
          </Avatar>
          <Avatar className="h-8 w-8 border-2 border-background">
            <AvatarFallback className="bg-accent text-accent-foreground text-xs">AS</AvatarFallback>
          </Avatar>
          <Avatar className="h-8 w-8 border-2 border-background">
            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">MK</AvatarFallback>
          </Avatar>
        </div>

        {/* Desktop share button */}
        <Button
          variant="outline"
          size="sm"
          className="hidden lg:flex h-9"
          onClick={onShareClick}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>

        {/* Desktop new doc button */}
        <Button
          size="sm"
          className="hidden lg:flex h-9"
        >
          <Plus className="mr-2 h-4 w-4" />
          New doc
        </Button>

        {/* Mobile search */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSearchClick}
          className="h-9 w-9 p-0 lg:hidden"
        >
          <SearchIcon className="h-5 w-5" />
        </Button>

        {/* Mobile settings */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSettingsClick}
          className="h-9 w-9 p-0 text-primary lg:hidden"
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>

        {/* More menu */}
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0"
          title="More options"
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
