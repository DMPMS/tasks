import { MigrationInterface, QueryRunner } from "typeorm";
import { TASK } from "../config/constants";

export class CreateTableTask1742389674953 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE public.task (
        id SERIAL NOT NULL,
        user_id INTEGER NOT NULL,
        title VARCHAR(${TASK.TITLE_LENGTH.MAX}) NOT NULL,
        description TEXT,
        priority INTEGER NOT NULL,
        completed_date TIMESTAMP WITHOUT TIME ZONE,
        limit_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,

        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,

        PRIMARY KEY (id),
        foreign key (user_id) references public.user(id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE public.task;`);
  }
}
