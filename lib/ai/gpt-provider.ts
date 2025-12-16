import OpenAI from 'openai';
import { BaseAIProvider } from './base-provider';
import { GenerateArticleParams } from '@/lib/types/ai';

export class GPTProvider extends BaseAIProvider {
  private client: OpenAI;

  constructor() {
    super();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    this.client = new OpenAI({ apiKey });
  }

  async generateArticle(params: GenerateArticleParams): Promise<string> {
    const prompt = this.buildPrompt(params);

    const completion = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
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
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content generated from GPT');
    }

    return content;
  }
}
