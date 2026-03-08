import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

export const isGeminiConfigured = apiKey.length > 0;

export function getGeminiModel(modelName = 'gemini-2.0-flash') {
  if (!isGeminiConfigured) {
    throw new Error('Gemini API key is not configured. AI features are unavailable.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: modelName });
}
