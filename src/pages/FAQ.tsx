import { useState } from 'react';
import { HelpCircle, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageContainer } from '@/components/PageContainer';

interface FAQItem {
  question: string;
  answer: string;
  category: 'app' | 'claims' | 'evidence' | 'privacy';
}

const faqData: FAQItem[] = [
  // App Usage
  {
    category: 'app',
    question: 'How do I get started with Vet Claim Support?',
    answer: 'Start by adding your service history and separation date in Settings. Then begin logging your symptoms, medical visits, and any exposures you experienced during service. The app will guide you through building your evidence.',
  },
  {
    category: 'app',
    question: 'Is my data backed up anywhere?',
    answer: 'Your data is encrypted and stored securely. We recommend using the Export Backup feature in Settings regularly to create a backup file you can save for safekeeping.',
  },
  {
    category: 'app',
    question: 'Can I use this app on multiple devices?',
    answer: 'Yes, but data doesn\'t sync automatically. Use the Export Backup feature to create a backup on one device, then use Restore from Backup on another device to transfer your data.',
  },
  {
    category: 'app',
    question: 'How do I export my data for my VSO?',
    answer: 'Use the Export PDF feature on the Dashboard. You can customize which sections to include and generate a professional PDF summary of your evidence.',
  },
  {
    category: 'app',
    question: 'What does the AI analysis feature do?',
    answer: 'The AI analysis reviews your logged symptoms, medical visits, and service history to suggest potential VA-ratable conditions you might qualify for. It also identifies secondary conditions that could increase your combined rating.',
  },

  // VA Claims Process
  {
    category: 'claims',
    question: 'What is a BDD claim?',
    answer: 'Benefits Delivery at Discharge (BDD) allows service members to file a VA disability claim 180-90 days before separation. This can result in receiving benefits soon after discharge.',
  },
  {
    category: 'claims',
    question: 'What is a C&P exam?',
    answer: 'Compensation & Pension (C&P) exams are medical examinations ordered by the VA to evaluate your claimed disabilities. The examiner assesses the severity and connection to your service.',
  },
  {
    category: 'claims',
    question: 'What is a nexus letter?',
    answer: 'A nexus letter is a medical opinion from a doctor stating that your current condition is "at least as likely as not" connected to your military service. It\'s crucial evidence for service connection.',
  },
  {
    category: 'claims',
    question: 'What are secondary conditions?',
    answer: 'Secondary conditions are disabilities caused or aggravated by an already service-connected condition. For example, depression secondary to chronic pain, or knee problems secondary to a service-connected back injury.',
  },
  {
    category: 'claims',
    question: 'How are combined ratings calculated?',
    answer: 'VA uses "VA math" - ratings are combined, not added. Each rating is applied to the remaining "whole person" percentage. For example, 50% + 30% = 65% (not 80%). Use our Rating Calculator for accurate estimates.',
  },

  // Evidence Requirements
  {
    category: 'evidence',
    question: 'What evidence do I need for my claim?',
    answer: 'Key evidence includes: Service Treatment Records (STRs), current medical records showing diagnosis, doctor summaries linking conditions to service, buddy statements from witnesses, and consistent symptom documentation.',
  },
  {
    category: 'evidence',
    question: 'What is a buddy statement?',
    answer: 'A buddy statement is a written account from someone who witnessed your condition or symptoms during service. Fellow service members, family, or friends can provide these statements to support your claim.',
  },
  {
    category: 'evidence',
    question: 'How often should I log my symptoms?',
    answer: 'Log symptoms as they occur for the most accurate record. At minimum, aim to log weekly. Consistent documentation over time shows the chronic nature of your conditions and their impact on daily life.',
  },
  {
    category: 'evidence',
    question: 'What is a DBQ?',
    answer: 'Disability Benefits Questionnaire (DBQ) is a standardized form used by medical professionals to document the severity of your condition. Private doctors can complete DBQs to support your claim.',
  },

  // Privacy & Data
  {
    category: 'privacy',
    question: 'Who can see my data?',
    answer: 'Only you. Your data is encrypted and stored securely. We do not sell, share, or use your personal information for marketing or advertising.',
  },
  {
    category: 'privacy',
    question: 'What happens if I clear my browser data?',
    answer: 'If you clear your browser data or storage, your local app data may be deleted. Always maintain current backups using the Export Backup feature in Settings.',
  },
  {
    category: 'privacy',
    question: 'Is the AI analysis private?',
    answer: 'When you use AI analysis, your data is sent to Google\'s Gemini API for processing. This is optional and only happens when you explicitly request analysis. We don\'t store or retain any data sent to or from the AI service.',
  },
  {
    category: 'privacy',
    question: 'Can I delete all my data?',
    answer: 'Yes. Clear your browser\'s site data for this app, or use your browser\'s developer tools to clear localStorage and IndexedDB. This permanently removes all your data.',
  },
];

const categoryLabels = {
  app: 'Using the App',
  claims: 'VA Claims Process',
  evidence: 'Evidence Requirements',
  privacy: 'Privacy & Data',
};

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFAQ = faqData.filter((item) => {
    const matchesSearch = searchTerm === '' ||
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const groupedFAQ = filteredFAQ.reduce((acc, item, _index) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push({ ...item, originalIndex: faqData.indexOf(item) });
    return acc;
  }, {} as Record<string, (FAQItem & { originalIndex: number })[]>);

  return (
    <PageContainer className="space-y-6 animate-fade-in">
      <div className="section-header">
        <div className="section-icon">
          <HelpCircle className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">Find answers to common questions</p>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              All
            </button>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  selectedCategory === key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Items */}
      {Object.entries(groupedFAQ).map(([category, items]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg">{categoryLabels[category as keyof typeof categoryLabels]}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {items.map((item) => (
              <div
                key={item.originalIndex}
                className="border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(item.originalIndex)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium text-foreground pr-4">{item.question}</span>
                  {expandedItems.has(item.originalIndex) ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {expandedItems.has(item.originalIndex) && (
                  <div className="px-4 pb-4 text-muted-foreground text-sm leading-relaxed border-t border-border pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {filteredFAQ.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">No results found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
