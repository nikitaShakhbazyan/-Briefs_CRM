import { NextRequest, NextResponse } from 'next/server';
import { AIProviderFactory } from '@/lib/ai';
import { AITool } from '@/lib/types/article';
import { GenerateArticleParams } from '@/lib/types/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { keyword, brandDomain, language, aiTool } = body;

    if (!keyword || !brandDomain || !language || !aiTool) {
      return NextResponse.json(
        { error: 'Missing required fields: keyword, brandDomain, language, aiTool' },
        { status: 400 }
      );
    }

    if (!['gpt', 'claude', 'perplexity', 'mock'].includes(aiTool)) {
      return NextResponse.json(
        { error: 'Invalid AI tool. Must be: gpt, claude, perplexity, or mock' },
        { status: 400 }
      );
    }

    const params: GenerateArticleParams = {
      keyword,
      brandDomain,
      language,
    };

    const provider = AIProviderFactory.createProvider(aiTool as AITool);
    const content = await provider.generateArticle(params);

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error generating article:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Failed to generate article';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
