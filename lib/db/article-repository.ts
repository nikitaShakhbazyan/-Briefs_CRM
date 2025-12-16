import connectDB from './mongodb';
import { ArticleModel } from '@/lib/models';
import { Article, CreateArticleInput, ArticleStatus } from '@/lib/types/article';

export class ArticleRepository {
  static async create(input: CreateArticleInput): Promise<Article> {
    await connectDB();

    const article = await ArticleModel.create({
      keyword: input.keyword,
      brandDomain: input.brandDomain,
      language: input.language,
      aiTool: input.aiTool,
      status: 'new',
    });

    return this.toPlainObject(article);
  }

  static async findByStatus(status: ArticleStatus): Promise<Article[]> {
    await connectDB();

    const articles = await ArticleModel.find({ status })
      .sort({ createdAt: 1 })
      .lean()
      .exec();

    return articles.map(this.toPlainObject);
  }

  static async findById(id: string): Promise<Article | null> {
    await connectDB();

    const article = await ArticleModel.findById(id).lean().exec();

    return article ? this.toPlainObject(article) : null;
  }

  static async findAll(): Promise<Article[]> {
    await connectDB();

    const articles = await ArticleModel.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return articles.map(this.toPlainObject);
  }

  static async updateStatus(
    id: string,
    status: ArticleStatus
  ): Promise<Article | null> {
    await connectDB();

    const article = await ArticleModel.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .lean()
      .exec();

    return article ? this.toPlainObject(article) : null;
  }

  static async complete(id: string, content: string): Promise<Article | null> {
    await connectDB();

    const article = await ArticleModel.findByIdAndUpdate(
      id,
      {
        status: 'completed',
        content,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    )
      .lean()
      .exec();

    return article ? this.toPlainObject(article) : null;
  }

  private static toPlainObject(doc: Record<string, any>): Article {
    return {
      _id: doc._id.toString(),
      keyword: doc.keyword,
      brandDomain: doc.brandDomain,
      language: doc.language,
      aiTool: doc.aiTool,
      status: doc.status,
      content: doc.content || undefined,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
