import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserEntity } from "@app/user/user.entity";
import { CreateArticleDto } from "@app/articles/dto/createArticle.dto";
import { ArticleEntity } from "@app/articles/article.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ArticleResponseInterface } from "@app/articles/types/articleResponse.interface";
import slugify from "slugify";
import { DeleteResult, Repository } from "typeorm";
import { ArticlesResponseInterface } from "@app/articles/types/articlesResponse.interface";
import { FollowEntity } from "@app/profile/follow.entity";

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async findAll(currentUserId: number, query: any): Promise<ArticlesResponseInterface> {
    const queryBuilder = this.articleRepository.createQueryBuilder(
      'articles'
    ).leftJoinAndSelect('articles.author', 'author');

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    if (query.author) {
      const author = await this.userRepository.findOne({
        username: query.author,
      })
      queryBuilder.andWhere('articles.authorId = :id', {
        id: author.id,
      })
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`
      });
    }

    if (query.favorited) {
      const author = await this.userRepository.findOne({
        username: query.favorited,
      }, {relations: ['favorites']});
      const ids = author.favorites.map((el) => el.id);
      queryBuilder.andWhere('articles.authorId IN(:...ids)', { ids });
    }

    let favoriteIds: number[] = [];
    if (currentUserId) {
      const currentUser = await this.userRepository.findOne(
        currentUserId,
        {relations: ['favorites']},
      )
      favoriteIds = currentUser.favorites.map((favorite) => favorite.id);
    }

    const articles = await queryBuilder.getMany();
    const articlesCount = await queryBuilder.getCount();

    const articlesWithFavorites = articles.map(article => {
      const favorited = favoriteIds.includes(article.id);

      return {
        ...article,
        favorited,
      };
    })

    return { articles: articlesWithFavorites, articlesCount };
  }

  async getFeed(currentUserId: number, query: any): Promise<ArticlesResponseInterface> {
    const follows = await this.followRepository.find({
      followerId: currentUserId,
    });

    if (follows.length === 0) {
      return {
        articles: [],
        articlesCount: 0,
      };
    }

    const followingUserIds = follows.map((follow) => follow.followingId);
    const queryBuilder = this.articleRepository
      .createQueryBuilder('articles')
      .where('articles.authorId IN (:...ids)', { ids: followingUserIds })
      .leftJoinAndSelect('articles.author', 'author')
    ;

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    if (query.limit) {

      queryBuilder.limit(query.limit);
    }
    if (query.offset) {

      queryBuilder.offset(query.offset);
    }
    const articles = await queryBuilder.getMany();
    const articlesCount = await queryBuilder.getCount();

    return {
      articles,
      articlesCount
    }
  }

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }
    article.slug = this.getSlug(createArticleDto.title);

    article.author = currentUser;

    return await this.articleRepository.save(article);
  }

  async updateArticle(
    slug: string,
    updateArticleDto: CreateArticleDto,
    currentUserId: number
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException('Article does not exists', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    Object.assign(article, updateArticleDto);
    return this.articleRepository.save(article);
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    return this.articleRepository.findOne({ slug });
  }

  async deleteArticle(slug: string, currentUserId: number): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    return await this.articleRepository.delete({ slug });
  }

  async addArticleToFavorites(slug: string, currentUserId: number): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne(currentUserId, {
      relations: ['favorites'],
    });
    const isNotFavorited = user.favorites.findIndex(
      (favoritedArticle) => favoritedArticle.id === article.id
    ) === -1;

    if (isNotFavorited) {
      user.favorites.push(article);
      article.favoritesCount++;
      await this.articleRepository.save(article);
      await this.userRepository.save(user);
    }

    return article;
  }

  async deleteArticleFromFavorites(slug: string, currentUserId: number): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne(currentUserId, {
      relations: ['favorites'],
    });
    const articleIndex = user.favorites.findIndex(
      (favoritedArticle) => favoritedArticle.id === article.id
    );

    if (articleIndex >= 0) {
      user.favorites.splice(articleIndex, 1);
      article.favoritesCount--;
      await this.userRepository.save(user);
      this.articleRepository.save(article);
    }

    return article;
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article };
  }

  private getSlug(title: string): string {
    return (
      slugify(title, {lower: true}) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
