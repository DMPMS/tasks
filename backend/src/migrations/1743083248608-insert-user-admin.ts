import { MigrationInterface, QueryRunner } from "typeorm";
import { ERROR_MESSAGES } from "../utils/messages";
import { createPasswordHashed } from "../utils/password";
import { UserTypeEnum } from "../enums/UserTypeEnum";

export class InsertUserAdmin1743083248608 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const firstAdminEmail = process.env.FIRST_ADMIN_EMAIL;
    const firstAdminPassword = process.env.FIRST_ADMIN_PASSWORD;

    if (!firstAdminEmail || !firstAdminPassword) {
      throw new Error(ERROR_MESSAGES.ENV.MISSING_FIRST_ADMIN_EMAIL_OR_PASSWORD);
    }

    const passwordHash = await createPasswordHashed(firstAdminPassword);

    await queryRunner.query(`
        INSERT INTO public.user (name, email, password, user_type)
        VALUES ('Usuário Admin', '${firstAdminEmail.toLowerCase()}', '${passwordHash}', ${
      UserTypeEnum.Admin
    });
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const firstAdminEmail = process.env.FIRST_ADMIN_EMAIL;

    if (!firstAdminEmail) {
      throw new Error(ERROR_MESSAGES.ENV.MISSING_FIRST_ADMIN_EMAIL);
    }

    await queryRunner.query(`
        DELETE FROM public.user WHERE email = '${firstAdminEmail.toLowerCase()}';
      `);
  }
}
