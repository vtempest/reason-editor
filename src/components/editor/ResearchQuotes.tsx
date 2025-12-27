import { useState } from 'react';
import { ResearchQuote } from '@/types/document';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Quote, Trash2, ExternalLink, Edit2, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface ResearchQuotesProps {
  documentId: string;
  quotes: ResearchQuote[];
  onQuotesChange: (quotes: ResearchQuote[]) => void;
}

export const ResearchQuotes = ({ documentId, quotes = [], onQuotesChange }: ResearchQuotesProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<ResearchQuote | null>(null);
  const [formData, setFormData] = useState({
    text: '',
    source: '',
    author: '',
    url: '',
    pageNumber: '',
    tags: '',
  });

  const handleAddQuote = () => {
    if (!formData.text.trim()) {
      toast.error('Quote text is required');
      return;
    }

    const newQuote: ResearchQuote = {
      id: Date.now().toString(),
      text: formData.text,
      source: formData.source || undefined,
      author: formData.author || undefined,
      url: formData.url || undefined,
      pageNumber: formData.pageNumber || undefined,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : undefined,
      createdAt: new Date().toISOString(),
      documentId,
    };

    onQuotesChange([...quotes, newQuote]);
    resetForm();
    setIsAddDialogOpen(false);
    toast.success('Quote added');
  };

  const handleUpdateQuote = () => {
    if (!editingQuote || !formData.text.trim()) {
      toast.error('Quote text is required');
      return;
    }

    const updatedQuotes = quotes.map(q =>
      q.id === editingQuote.id
        ? {
          ...q,
          text: formData.text,
          source: formData.source || undefined,
          author: formData.author || undefined,
          url: formData.url || undefined,
          pageNumber: formData.pageNumber || undefined,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : undefined,
        }
        : q
    );

    onQuotesChange(updatedQuotes);
    setEditingQuote(null);
    resetForm();
    toast.success('Quote updated');
  };

  const handleDeleteQuote = (quoteId: string) => {
    onQuotesChange(quotes.filter(q => q.id !== quoteId));
    toast.success('Quote deleted');
  };

  const handleCopyQuote = (quote: ResearchQuote) => {
    const formatted = `"${quote.text}"\n${quote.author ? `- ${quote.author}` : ''}${quote.source ? `, ${quote.source}` : ''}${quote.pageNumber ? ` (p. ${quote.pageNumber})` : ''}`;
    navigator.clipboard.writeText(formatted);
    toast.success('Quote copied to clipboard');
  };

  const handleEditQuote = (quote: ResearchQuote) => {
    setEditingQuote(quote);
    setFormData({
      text: quote.text,
      source: quote.source || '',
      author: quote.author || '',
      url: quote.url || '',
      pageNumber: quote.pageNumber || '',
      tags: quote.tags?.join(', ') || '',
    });
  };

  const resetForm = () => {
    setFormData({
      text: '',
      source: '',
      author: '',
      url: '',
      pageNumber: '',
      tags: '',
    });
  };

  const handleExtractQuotes = () => {
    // Extract quotes from document content (simple implementation)
    // Looking for text in quotation marks or blockquotes
    toast.info('Quote extraction coming soon!');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Quote className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Research Quotes</h3>
          <Badge variant="secondary">{quotes.length}</Badge>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleExtractQuotes}
            variant="outline"
            size="sm"
          >
            Extract from Text
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Quote
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Research Quote</DialogTitle>
                <DialogDescription>
                  Add a quote or citation from your research
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="text">Quote Text *</Label>
                  <Textarea
                    id="text"
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    placeholder="Enter the quote text..."
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="source">Source</Label>
                    <Input
                      id="source"
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      placeholder="Book Title, Article Name, etc."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pageNumber">Page Number</Label>
                    <Input
                      id="pageNumber"
                      value={formData.pageNumber}
                      onChange={(e) => setFormData({ ...formData, pageNumber: e.target.value })}
                      placeholder="123"
                    />
                  </div>
                  <div>
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="research, climate, data"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddQuote}>Add Quote</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Quote Dialog */}
      <Dialog open={!!editingQuote} onOpenChange={() => setEditingQuote(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Research Quote</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-text">Quote Text *</Label>
              <Textarea
                id="edit-text"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-author">Author</Label>
                <Input
                  id="edit-author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-source">Source</Label>
                <Input
                  id="edit-source"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-pageNumber">Page Number</Label>
                <Input
                  id="edit-pageNumber"
                  value={formData.pageNumber}
                  onChange={(e) => setFormData({ ...formData, pageNumber: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-url">URL</Label>
                <Input
                  id="edit-url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingQuote(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateQuote}>Update Quote</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quotes List */}
      <div className="space-y-3">
        {quotes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Quote className="h-12 w-12 text-muted-foreground opacity-50 mb-3" />
              <p className="text-sm text-muted-foreground">
                No research quotes yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Add quotes to organize your research
              </p>
            </CardContent>
          </Card>
        ) : (
          quotes.map((quote) => (
            <Card key={quote.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardDescription className="mb-2 text-base italic">
                      "{quote.text}"
                    </CardDescription>
                    {(quote.author || quote.source) && (
                      <CardTitle className="text-sm font-normal text-muted-foreground">
                        {quote.author && <span>— {quote.author}</span>}
                        {quote.source && <span>, {quote.source}</span>}
                        {quote.pageNumber && <span> (p. {quote.pageNumber})</span>}
                      </CardTitle>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyQuote(quote)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditQuote(quote)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteQuote(quote.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {(quote.url || quote.tags) && (
                <CardContent className="pt-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {quote.url && (
                      <a
                        href={quote.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Source Link
                      </a>
                    )}
                    {quote.tags && quote.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
