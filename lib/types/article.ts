export type ArticleStatus = 'new' | 'pending' | 'completed';

export type AITool = 'gpt' | 'claude' | 'perplexity' | 'mock';

export interface Article {
  _id?: string;
  keyword: string;
  brandDomain: string;
  language: string;
  aiTool: AITool;
  status: ArticleStatus;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateArticleInput {
  keyword: string;
  brandDomain: string;
  language: string;
  aiTool: AITool;
}

export interface CompleteArticleInput {
  articleId: string;
  content: string;
}
