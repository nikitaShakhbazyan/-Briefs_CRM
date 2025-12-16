import axios from 'axios';
import { BaseAIProvider } from './base-provider';
import { GenerateArticleParams } from '@/lib/types/ai';

export class PerplexityProvider extends BaseAIProvider {
  private apiKey: string;
  private apiUrl = 'https://api.perplexity.ai/chat/completions';

  constructor() {
    super();
    const apiKey = process.env.PERPLEXITY_API_KEY;

    if (!apiKey) {
      throw new Error('PERPLEXITY_API_KEY is not set');
    }

    this.apiKey = apiKey;
  }

  async generateArticle(params: GenerateArticleParams): Promise<string> {
    const prompt = this.buildPrompt(params);

    const response = await axios.post(
      this.apiUrl,
      {
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are an expert content writer specializing in SEO-optimized articles.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content generated from Perplexity');
    }

    return content;
  }
}
