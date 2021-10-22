import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArticleEntity } from "@app/articles/article.entity";
import { UserModule } from "@app/user/user.module";
import { ProfileModule } from "@app/profile/profile.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity]),
    UserModule,
    ProfileModule,
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService]
})
export class ArticlesModule {}
