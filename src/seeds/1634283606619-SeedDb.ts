import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDb1634283606619 implements MigrationInterface {
  name = "SeedDb1634283606619";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
             INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('nestjs')
    `);

    await queryRunner.query(`
             INSERT INTO users (email, password, username)
             VALUES (
                     'stanSmith@gmail.com',
                     '$2b$10$T5ZnvEUZJk39bl0MQdJgr.X7F26f0NGAV.O/.S6xbecLHqAshFwha',
                     '33Smith22'
                     ),
                    (
                     'johnWalker@gmail.com',
                      '$2b$10$9y4pwdKvuSWXYQAGdZcgS.RWFfK0065XdYlAU4P3VlDAwQaWFaoWu',
                      'john322'
                    )
    `);

    await queryRunner.query(`
             INSERT INTO articles (slug, title, description, body, "tagList", "authorId")
             VALUES (
                      'first-article',
                      'First article',
                      'first article desc',
                      'first article body',
                      'coffee,dragons',
                      1
                    ),
                    (
                      'second-article',
                      'Second article',
                      'second article desc',
                      'second article body',
                      'coffee,dragons',
                      1
                    )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
