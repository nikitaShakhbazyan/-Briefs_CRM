'use client';

import { useState, useEffect, use } from 'react';
import { Article } from '@/lib/types/article';
import Link from 'next/link';

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const resolvedParams = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error('Article not found');
        }
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Article not found
          </h1>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to articles
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">
                {new Date(article.createdAt).toLocaleString()}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  article.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {article.status}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="font-medium">Keyword:</span>
              <span>{article.keyword}</span>
              <span>•</span>
              <span>{article.brandDomain}</span>
              <span>•</span>
              <span>{article.language.toUpperCase()}</span>
              <span>•</span>
              <span className="capitalize">{article.aiTool}</span>
            </div>
          </div>

          {article.content ? (
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-800">
                {article.content}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-gray-600">
                Article is being generated... Please check back soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
