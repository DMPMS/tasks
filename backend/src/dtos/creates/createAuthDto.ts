import { IsString, Length, Validate } from "class-validator";
import { IsCustomEmail } from "../../validators/isCustomEmail";
import { USER } from "../../config/constants";

export class CreateAuthDto {
  @IsString()
  @Validate(IsCustomEmail)
  @Length(USER.EMAIL_LENGTH.MIN, USER.EMAIL_LENGTH.MAX)
  email!: string;

  @IsString()
  @Length(USER.PASSWORD_LENGTH.MIN, USER.PASSWORD_LENGTH.MAX)
  password!: string;
}
