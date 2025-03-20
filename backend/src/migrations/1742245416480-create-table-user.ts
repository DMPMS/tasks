import { MigrationInterface, QueryRunner } from "typeorm";
import { USER } from "../config/constants";

export class CreateTableUser1742245416480 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.user (
        id SERIAL NOT NULL,
        name VARCHAR(${USER.NAME_LENGTH.MAX}) NOT NULL,
        email VARCHAR(${USER.EMAIL_LENGTH.MAX}) NOT NULL,
        password VARCHAR (${USER.PASSWORD_LENGTH.MAX}) NOT NULL,
        user_type INTEGER NOT NULL,

        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,

        PRIMARY KEY (id),
        UNIQUE(email)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE public.user;`);
  }
}
