import { NextRequest, NextResponse } from 'next/server';
import { ArticleRepository } from '@/lib/db';
import { ArticleStatus } from '@/lib/types/article';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Missing required field: status' },
        { status: 400 }
      );
    }

    if (!['new', 'pending', 'completed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: new, pending, or completed' },
        { status: 400 }
      );
    }

    const article = await ArticleRepository.updateStatus(
      id,
      status as ArticleStatus
    );

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error updating article status:', error);
    return NextResponse.json(
      { error: 'Failed to update article status' },
      { status: 500 }
    );
  }
}
