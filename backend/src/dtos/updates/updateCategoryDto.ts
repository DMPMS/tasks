import { IsString, Length } from "class-validator";
import { CATEGORY } from "../../config/constants";

export class UpdateCategoryDto {
  @IsString()
  @Length(CATEGORY.NAME_LENGTH.MIN, CATEGORY.NAME_LENGTH.MAX)
  name!: string;
}
