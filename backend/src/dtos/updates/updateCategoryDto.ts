import { IsString, Length } from "class-validator";
import { CATEGORY } from "../../config/constants";
import { Expose } from "class-transformer";

export class UpdateCategoryDto {
  @Expose()
  @IsString()
  @Length(CATEGORY.NAME_LENGTH.MIN, CATEGORY.NAME_LENGTH.MAX)
  name!: string;
}
