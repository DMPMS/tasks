import { IsString, Validate } from "class-validator";
import { IsCustomEmail } from "../../validators/isCustomEmail";
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
