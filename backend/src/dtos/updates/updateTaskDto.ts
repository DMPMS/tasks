import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Validate,
} from "class-validator";
import { TASK } from "../../config/constants";
import { PriorityEnum } from "../../enums/PriorityEnum";
import { IsCustomTimestamp } from "../../validators/isCustomTimestamp";
import { Expose } from "class-transformer";

export class UpdateTaskDto {
  @Expose()
  @IsInt()
  @IsOptional()
  categoryId?: number | null;

  @Expose()
  @IsString()
  @Length(TASK.TITLE_LENGTH.MIN, TASK.TITLE_LENGTH.MAX)
  title!: string;

  @Expose()
  @IsString()
  @IsOptional()
  description?: string | null;

  @Expose()
  @IsEnum(PriorityEnum)
  priority!: PriorityEnum;

  @Expose()
  @Validate(IsCustomTimestamp)
  limitDate!: string;
}
