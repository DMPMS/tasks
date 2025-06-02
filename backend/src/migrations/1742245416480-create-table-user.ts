import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUser1742245416480 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.user (
        id SERIAL NOT NULL,
        
        name VARCHAR(30) NOT NULL CHECK (LENGTH(name) >= 8),
        email VARCHAR(100) NOT NULL CHECK (LENGTH(email) >= 8),
        password VARCHAR(60) NOT NULL CHECK (LENGTH(password) = 60),
        user_type INTEGER NOT NULL,

        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,

        PRIMARY KEY (id),
        UNIQUE (email)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE public.user;`);
  }
}
