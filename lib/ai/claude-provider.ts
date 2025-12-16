import Anthropic from '@anthropic-ai/sdk';
import { BaseAIProvider } from './base-provider';
import { GenerateArticleParams } from '@/lib/types/ai';

export class ClaudeProvider extends BaseAIProvider {
  private client: Anthropic;

  constructor() {
    super();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set');
    }

    this.client = new Anthropic({ apiKey });
  }

  async generateArticle(params: GenerateArticleParams): Promise<string> {
    const prompt = this.buildPrompt(params);

    const message = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];

    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    return content.text;
  }
}
