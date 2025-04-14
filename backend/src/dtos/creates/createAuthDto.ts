import { IsString, Length, Validate } from "class-validator";
import { IsCustomEmail } from "../../validators/isCustomEmail";
import { USER } from "../../config/constants";
import { Expose } from "class-transformer";

export class CreateAuthDto {
  @Expose()
  @IsString()
  @Validate(IsCustomEmail)
  email!: string;

  @Expose()
  @IsString()
  password!: string;
}
