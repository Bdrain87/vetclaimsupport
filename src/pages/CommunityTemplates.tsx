import { useState, useEffect } from 'react';
import { ChevronLeft, Search, ThumbsUp, Copy, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { vcsSpring } from '@/constants/animations';
import { PageContainer } from '@/components/PageContainer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Clipboard } from '@capacitor/clipboard';
import { toast } from '@/hooks/use-toast';
import { impactMedium } from '@/lib/haptics';
import { supabase } from '@/lib/supabase';
import { logger } from '@/utils/logger';

interface Template {
  id: string;
  title: string;
  category: string;
  content: string;
  upvotes: number;
  created_at: string;
}

const CATEGORIES = ['All', 'Personal Statement', 'Buddy Statement', 'Nexus Letter', 'Stressor Statement', 'Impact Statement'] as const;

export default function CommunityTemplates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('community_templates')
        .select('*')
        .eq('status', 'approved')
        .order('upvotes', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTemplates(data || []);
    } catch (err) {
      logger.warn('[community] Failed to load templates:', err);
      // Graceful fallback — feature not available yet
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id: string) => {
    impactMedium();
    try {
      await supabase.rpc('upvote_template', { template_id: id });
      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? { ...t, upvotes: t.upvotes + 1 } : t)),
      );
    } catch {
      toast({ title: 'Could not upvote', variant: 'destructive' });
    }
  };

  const handleCopy = async (content: string) => {
    impactMedium();
    await Clipboard.write({ string: content });
    toast({ title: 'Template copied to clipboard' });
  };

  const filtered = templates.filter((t) => {
    const matchesCategory = category === 'All' || t.category === category;
    const matchesSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.content.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageContainer className="space-y-6 animate-fade-in py-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Community Templates</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Anonymous, veteran-submitted templates reviewed for quality. Use as a starting point — always personalize with your own facts.
        </p>
      </div>

      {/* Moderation notice */}
      <div className="flex items-start gap-3 p-3 rounded-xl bg-gold/5 border border-gold/20">
        <Shield className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground">
          All templates are anonymous and moderated before publishing. No personal information is shared. Templates are samples only — not legal advice.
        </p>
      </div>

      {/* Search + filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategory(cat)}
              className="flex-shrink-0 text-xs"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates list */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Loading templates...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <p className="text-muted-foreground text-sm">
            {templates.length === 0
              ? 'Community templates are coming soon. Check back after the next update.'
              : 'No templates match your search.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...vcsSpring, delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">{template.title}</h3>
                  <p className="text-[11px] text-gold">{template.category}</p>
                </div>
                <button
                  onClick={() => handleUpvote(template.id)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-gold transition-colors flex-shrink-0"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  {template.upvotes}
                </button>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-4 whitespace-pre-wrap">
                {template.content}
              </p>
              <Button
                onClick={() => handleCopy(template.content)}
                variant="outline"
                size="sm"
                className="w-full gap-2"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy Template
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      <p className="text-[10px] text-muted-foreground/60 text-center italic pt-4">
        Templates are community-submitted samples. Always personalize with your own facts and consult a VSO or attorney before submitting anything to the VA.
      </p>
    </PageContainer>
  );
}
