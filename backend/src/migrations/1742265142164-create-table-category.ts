import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableCategory1742265142164 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.category (
        id SERIAL NOT NULL,
        user_id INTEGER NOT NULL,
        
        name VARCHAR(20) NOT NULL,

        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES public.user(id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE public.category;`);
  }
}
