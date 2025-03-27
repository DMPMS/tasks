import { MigrationInterface, QueryRunner } from "typeorm";
import { CATEGORY } from "../config/constants";

export class CreateTableCategory1742265142164 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE public.category (
        id SERIAL NOT NULL,
        user_id INTEGER NOT NULL,
        
        name VARCHAR(${CATEGORY.NAME_LENGTH.MAX}) NOT NULL CHECK (LENGTH(name) >= ${CATEGORY.NAME_LENGTH.MIN}),

        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,

        PRIMARY KEY (id),
        foreign key (user_id) references public.user(id) ON DELETE CASCADE
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE public.category;`);
  }
}
