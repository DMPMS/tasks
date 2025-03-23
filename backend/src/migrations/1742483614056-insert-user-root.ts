import { MigrationInterface, QueryRunner } from "typeorm";
import { UserTypeEnum } from "../enums/UserTypeEnum";
import { ERROR_MESSAGES } from "../utils/messages";
import { createPasswordHashed } from "../utils/password";

export class InsertUserRoot1742483614056 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const rootEmail = process.env.ROOT_EMAIL;
    const rootPassword = process.env.ROOT_PASSWORD;

    if (!rootEmail || !rootPassword) {
      throw new Error(ERROR_MESSAGES.ENV.MISSING_ROOT_EMAIL_OR_PASSWORD);
    }

    const passwordHash = await createPasswordHashed(rootPassword);

    await queryRunner.query(`
      INSERT INTO public.user (name, email, password, user_type)
      VALUES ('Root', '${rootEmail.toLowerCase()}', '${passwordHash}', ${
      UserTypeEnum.Root
    });
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const rootEmail = process.env.ROOT_EMAIL;

    if (!rootEmail) {
      throw new Error(ERROR_MESSAGES.ENV.MISSING_ROOT_EMAIL);
    }

    await queryRunner.query(`
      DELETE FROM public.user WHERE email = '${rootEmail.toLowerCase()}';
    `);
  }
}
