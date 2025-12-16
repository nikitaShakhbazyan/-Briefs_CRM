'use client';

import { useState } from 'react';
import { Article, AITool } from '@/lib/types/article';

interface ArticleFormProps {
  onArticleCreated: (article: Article) => void;
}

export default function ArticleForm({ onArticleCreated }: ArticleFormProps) {
  const [keyword, setKeyword] = useState('');
  const [brandDomain, setBrandDomain] = useState('');
  const [language, setLanguage] = useState('en');
  const [aiTool, setAiTool] = useState<AITool>('mock');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword,
          brandDomain,
          language,
          aiTool,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create article');
      }

      const article = await response.json();
      onArticleCreated(article);

      setKeyword('');
      setBrandDomain('');
      setLanguage('en');
      setAiTool('mock');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Create New Article
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="keyword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Keyword
          </label>
          <input
            type="text"
            id="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="e.g., AI technology"
          />
        </div>

        <div>
          <label
            htmlFor="brandDomain"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Brand Domain
          </label>
          <input
            type="text"
            id="brandDomain"
            value={brandDomain}
            onChange={(e) => setBrandDomain(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="e.g., example.com"
          />
        </div>

        <div>
          <label
            htmlFor="language"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Language
          </label>
          <input
            type="text"
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            required
            maxLength={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="e.g., en, he, ru"
          />
        </div>

        <div>
          <label
            htmlFor="aiTool"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            AI Tool
          </label>
          <select
            id="aiTool"
            value={aiTool}
            onChange={(e) => setAiTool(e.target.value as AITool)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value="mock">Mock (Testing)</option>
            <option value="gpt">GPT-4o Mini</option>
            <option value="claude">Claude 3.5 Sonnet</option>
            <option value="perplexity">Perplexity Sonar</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Creating...' : 'Create Article'}
        </button>
      </form>
    </div>
  );
}
