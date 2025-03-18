import { IsString, Length, Validate } from "class-validator";
import { IsCustomEmail } from "../../validators/isCustomEmail";
import { USER } from "../../config/constants";

export class CreateUserDTO {
  @IsString()
  @Length(USER.NAME_LENGTH.MIN, USER.NAME_LENGTH.MAX)
  name!: string;

  @IsString()
  @Validate(IsCustomEmail)
  @Length(USER.EMAIL_LENGTH.MIN, USER.EMAIL_LENGTH.MAX)
  email!: string;
}
