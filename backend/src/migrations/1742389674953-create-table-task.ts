import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableTask1742389674953 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE public.task (
        id SERIAL NOT NULL,
        user_id INTEGER NOT NULL,
        category_id INTEGER,
        
        title VARCHAR(60) NOT NULL,
        description TEXT,
        priority INTEGER NOT NULL,
        completed_date TIMESTAMP WITHOUT TIME ZONE,
        limit_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,

        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES public.user(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (category_id) REFERENCES public.category(id) ON DELETE SET NULL ON UPDATE CASCADE
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE public.task;`);
  }
}
