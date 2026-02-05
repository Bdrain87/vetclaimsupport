import { useState } from 'react';
import { AI_CONFIG } from '@/lib/ai-prompts';

export const useGemini = (persona: keyof typeof AI_CONFIG) => {
  const [isLoading, setIsLoading] = useState(false);

  const generate = async (input: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${AI_CONFIG[persona]}\n\nInput: ${input}` }]
          }]
        })
      });

      const data = await res.json();
      return data.candidates[0].content.parts[0].text;
    } finally {
      setIsLoading(false);
    }
  };

  return { generate, isLoading };
};
