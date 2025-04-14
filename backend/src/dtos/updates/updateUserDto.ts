import { IsOptional, IsString, Length, Validate } from "class-validator";
import { IsCustomEmail } from "../../validators/isCustomEmail";
import { USER } from "../../config/constants";
import { Expose } from "class-transformer";

export class UpdateUserDto {
  @Expose()
  @IsString()
  @Length(USER.NAME_LENGTH.MIN, USER.NAME_LENGTH.MAX)
  name!: string;

  @Expose()
  @IsString()
  @Validate(IsCustomEmail)
  @Length(USER.EMAIL_LENGTH.MIN, USER.EMAIL_LENGTH.MAX)
  email!: string;

  @Expose()
  @IsString()
  @IsOptional()
  @Length(USER.PASSWORD_LENGTH.MIN, USER.PASSWORD_LENGTH.MAX)
  newPassword!: string;

  @Expose()
  @IsString()
  @IsOptional()
  @Length(USER.CONFIRM_PASSWORD_LENGTH.MIN, USER.CONFIRM_PASSWORD_LENGTH.MAX)
  confirmNewPassword!: string;

  @Expose()
  @IsString()
  password!: string;
}
