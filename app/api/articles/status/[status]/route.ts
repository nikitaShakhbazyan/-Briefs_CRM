import { NextRequest, NextResponse } from 'next/server';
import { ArticleRepository } from '@/lib/db';
import { ArticleStatus } from '@/lib/types/article';

interface RouteContext {
  params: Promise<{ status: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { status } = await context.params;

    if (!['new', 'pending', 'completed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: new, pending, or completed' },
        { status: 400 }
      );
    }

    const articles = await ArticleRepository.findByStatus(
      status as ArticleStatus
    );

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles by status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
