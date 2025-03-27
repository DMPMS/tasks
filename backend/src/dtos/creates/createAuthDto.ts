import { IsString, Length, Validate } from "class-validator";
import { IsCustomEmail } from "../../validators/isCustomEmail";
import { USER } from "../../config/constants";

export class CreateAuthDto {
  @IsString()
  @Validate(IsCustomEmail)
  email!: string;

  @IsString()
  password!: string;
}
