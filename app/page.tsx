'use client';

import { useState, useEffect } from 'react';
import { Article } from '@/lib/types/article';
import ArticleForm from '@/components/ArticleForm';
import ArticleList from '@/components/ArticleList';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();

    const interval = setInterval(fetchArticles, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleArticleCreated = (article: Article) => {
    setArticles([article, ...articles]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Article Generator
          </h1>
          <p className="text-lg text-gray-600">
            Create SEO-optimized articles using AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ArticleForm onArticleCreated={handleArticleCreated} />
          </div>

          <div className="lg:col-span-2">
            <ArticleList articles={articles} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
