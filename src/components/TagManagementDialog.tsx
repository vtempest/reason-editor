import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface TagManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTags: string[];
  onUpdateTags: (tags: string[]) => void;
}

export const TagManagementDialog = ({
  open,
  onOpenChange,
  currentTags,
  onUpdateTags,
}: TagManagementDialogProps) => {
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>(currentTags);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
  };

  const handleSave = () => {
    onUpdateTags(tags);
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter tag name..."
              className="flex-1"
            />
            <Button onClick={handleAddTag} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border border-border rounded-md bg-muted/20">
            {tags.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tags added yet</p>
            ) : (
              tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="gap-1 pl-2 pr-1"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:bg-background/80 rounded-sm p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Tags
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
