export interface GenerateArticleParams {
  keyword: string;
  brandDomain: string;
  language: string;
}

export interface AIProvider {
  generateArticle(params: GenerateArticleParams): Promise<string>;
}
