import { ArticleEntity } from "@app/articles/article.entity";

export type ArticleType = Omit<ArticleEntity, "updateTimestamp">;