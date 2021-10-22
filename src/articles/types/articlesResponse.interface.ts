import { ArticleType } from "@app/articles/types/article.type";

export interface ArticlesResponseInterface {
  articles: ArticleType[];
  articlesCount: number;
}