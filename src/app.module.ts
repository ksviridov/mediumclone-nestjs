import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { AppController } from "@app/app.controller";
import { AppService } from "@app/app.service";
import { TagsModule } from "@app/tags/tags.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import ormconfig from "@app/ormconfig";
import { AuthMiddleware } from "@app/user/middlewares/auth.middleware";
import { ArticlesModule } from './articles/articles.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    TagsModule,
    TypeOrmModule.forRoot(ormconfig),
    UserModule,
    ArticlesModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    });
  }
}
