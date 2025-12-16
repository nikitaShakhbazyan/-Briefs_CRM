import mongoose, { Schema, Model } from 'mongoose';
import { Article } from '@/lib/types/article';

const articleSchema = new Schema<Article>(
  {
    keyword: {
      type: String,
      required: [true, 'Keyword is required'],
      trim: true,
      minlength: [1, 'Keyword must not be empty'],
    },
    brandDomain: {
      type: String,
      required: [true, 'Brand domain is required'],
      trim: true,
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      trim: true,
      minlength: [2, 'Language code must be at least 2 characters'],
    },
    aiTool: {
      type: String,
      required: [true, 'AI tool is required'],
      enum: {
        values: ['gpt', 'claude', 'perplexity', 'mock'],
        message: '{VALUE} is not a supported AI tool',
      },
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['new', 'pending', 'completed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'new',
    },
    content: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

articleSchema.index({ status: 1, createdAt: 1 });
articleSchema.index({ createdAt: -1 });

const ArticleModel: Model<Article> =
  mongoose.models.Article || mongoose.model<Article>('Article', articleSchema);

export default ArticleModel;
