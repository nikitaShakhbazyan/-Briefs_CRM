import { AIProvider, GenerateArticleParams } from '@/lib/types/ai';

export abstract class BaseAIProvider implements AIProvider {
  protected buildPrompt(params: GenerateArticleParams): string {
    return `Write a comprehensive SEO-optimized article about "${params.keyword}" for the brand ${params.brandDomain}.

Language: ${params.language}

Requirements:
- Create an engaging, informative article
- Optimize for SEO with the keyword "${params.keyword}"
- Make it relevant to ${params.brandDomain}
- Write in ${params.language} language
- Include a catchy title
- Length: 800-1200 words

Please provide only the article content without any meta-commentary.`;
  }

  abstract generateArticle(params: GenerateArticleParams): Promise<string>;
}
