import { BaseAIProvider } from './base-provider';
import { GenerateArticleParams } from '@/lib/types/ai';

export class MockAIProvider extends BaseAIProvider {
  async generateArticle(params: GenerateArticleParams): Promise<string> {
    await this.simulateDelay();

    return `# ${params.keyword} - Comprehensive Guide

## Introduction

Welcome to this comprehensive guide about **${params.keyword}** brought to you by ${params.brandDomain}. This article will explore everything you need to know about this topic.

## What is ${params.keyword}?

${params.keyword} is a fascinating subject that has gained significant attention in recent times. Understanding ${params.keyword} is essential for anyone interested in this field.

## Key Benefits

1. **Enhanced Understanding**: Learning about ${params.keyword} provides valuable insights
2. **Practical Applications**: ${params.keyword} has numerous real-world applications
3. **Future Trends**: Staying informed about ${params.keyword} helps you stay ahead

## Best Practices

When working with ${params.keyword}, it's important to follow industry best practices. Here are some key recommendations:

- Research thoroughly before implementation
- Stay updated with the latest trends
- Consult with experts in the field
- Test and iterate your approach

## How ${params.brandDomain} Can Help

At ${params.brandDomain}, we specialize in providing solutions related to ${params.keyword}. Our expertise ensures that you get the best possible outcomes.

## Conclusion

Understanding ${params.keyword} is crucial in today's landscape. By following the guidelines and best practices outlined in this article, you'll be well-equipped to succeed.

For more information about ${params.keyword}, visit ${params.brandDomain} today.

---
*This article was generated for demonstration purposes.*
*Language: ${params.language}*`;
  }

  private async simulateDelay(): Promise<void> {
    const delay = Math.random() * 2000 + 1000;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}
