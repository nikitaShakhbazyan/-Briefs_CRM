import { NextRequest, NextResponse } from 'next/server';
import { ArticleRepository } from '@/lib/db';
import { CreateArticleInput } from '@/lib/types/article';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { keyword, brandDomain, language, aiTool } = body;

    if (!keyword || !brandDomain || !language || !aiTool) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['gpt', 'claude', 'perplexity', 'mock'].includes(aiTool)) {
      return NextResponse.json(
        { error: 'Invalid AI tool. Must be: gpt, claude, perplexity, or mock' },
        { status: 400 }
      );
    }

    const input: CreateArticleInput = {
      keyword,
      brandDomain,
      language,
      aiTool,
    };

    const article = await ArticleRepository.create(input);

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const articles = await ArticleRepository.findAll();
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
