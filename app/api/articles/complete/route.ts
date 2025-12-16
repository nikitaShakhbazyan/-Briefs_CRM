import { NextRequest, NextResponse } from 'next/server';
import { ArticleRepository } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { articleId, content } = body;

    if (!articleId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: articleId, content' },
        { status: 400 }
      );
    }

    const article = await ArticleRepository.complete(articleId, content);

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error completing article:', error);
    return NextResponse.json(
      { error: 'Failed to complete article' },
      { status: 500 }
    );
  }
}
