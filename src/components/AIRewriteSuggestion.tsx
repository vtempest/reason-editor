import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIRewriteSuggestionProps {
  originalText: string;
  suggestedText: string;
  onApprove: () => void;
  onReject: () => void;
  isLoading?: boolean;
}

export const AIRewriteSuggestion = ({
  originalText,
  suggestedText,
  onApprove,
  onReject,
  isLoading = false,
}: AIRewriteSuggestionProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-popover p-3 shadow-lg">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Generating AI suggestion...</span>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-popover shadow-lg max-w-xl">
      <div className="p-3 border-b border-border">
        <div className="text-xs font-semibold text-muted-foreground mb-2">AI SUGGESTION</div>
        <div className="space-y-2">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Original:</div>
            <div className="text-sm text-foreground/70 line-through">{originalText}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Suggested:</div>
            <div className="text-sm text-foreground font-medium">{suggestedText}</div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onApprove}
          className="flex-1 h-9 bg-green-500 hover:bg-green-600 text-white"
          title="Approve"
        >
          <Check className="h-4 w-4 mr-1" />
          Approve
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReject}
          className="flex-1 h-9 bg-red-500 hover:bg-red-600 text-white"
          title="Reject"
        >
          <X className="h-4 w-4 mr-1" />
          Reject
        </Button>
      </div>
    </div>
  );
};
