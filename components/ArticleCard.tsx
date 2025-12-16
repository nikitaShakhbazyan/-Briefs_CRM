'use client';

import { Article } from '@/lib/types/article';
import Link from 'next/link';

interface ArticleCardProps {
  article: Article;
}

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
};

const statusLabels = {
  new: 'New',
  pending: 'Generating...',
  completed: 'Completed',
};

const aiToolLabels = {
  gpt: 'GPT-4o Mini',
  claude: 'Claude 3.5',
  perplexity: 'Perplexity',
  mock: 'Mock',
};

export default function ArticleCard({ article }: ArticleCardProps) {
  const formattedDate = new Date(article.createdAt).toLocaleString();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {article.keyword}
          </h3>
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              {article.brandDomain}
            </span>
            <span>•</span>
            <span>{article.language.toUpperCase()}</span>
            <span>•</span>
            <span>{aiToolLabels[article.aiTool]}</span>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusColors[article.status]
          }`}
        >
          {statusLabels[article.status]}
        </span>
      </div>

      <div className="text-sm text-gray-500 mb-4">{formattedDate}</div>

      {article.status === 'completed' && article.content && (
        <div className="mt-4">
          <div className="bg-gray-50 rounded p-4 mb-4">
            <p className="text-sm text-gray-700 line-clamp-3">
              {article.content.substring(0, 200)}...
            </p>
          </div>
          <Link
            href={`/articles/${article._id}`}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            View Full Article
          </Link>
        </div>
      )}

      {article.status === 'pending' && (
        <div className="mt-4 flex items-center text-sm text-gray-600">
          <svg
            className="animate-spin h-4 w-4 mr-2"
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
          AI is generating your article...
        </div>
      )}
    </div>
  );
}
