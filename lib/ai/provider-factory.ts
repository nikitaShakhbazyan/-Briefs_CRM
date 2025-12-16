import { AIProvider } from '@/lib/types/ai';
import { AITool } from '@/lib/types/article';
import { GPTProvider } from './gpt-provider';
import { ClaudeProvider } from './claude-provider';
import { PerplexityProvider } from './perplexity-provider';
import { MockAIProvider } from './mock-provider';

export class AIProviderFactory {
  static createProvider(tool: AITool): AIProvider {
    switch (tool) {
      case 'gpt':
        return new GPTProvider();
      case 'claude':
        return new ClaudeProvider();
      case 'perplexity':
        return new PerplexityProvider();
      case 'mock':
        return new MockAIProvider();
      default:
        throw new Error(`Unsupported AI tool: ${tool}`);
    }
  }
}
