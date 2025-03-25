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

export class UpdateTaskDto {
  @IsInt()
  @IsOptional()
  categoryId?: number | null;

  @IsString()
  @Length(TASK.TITLE_LENGTH.MIN, TASK.TITLE_LENGTH.MAX)
  title!: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsEnum(PriorityEnum)
  priority!: PriorityEnum;

  @Validate(IsCustomTimestamp)
  limitDate!: Date;

  @Validate(IsCustomTimestamp)
  @IsOptional()
  completedDate?: Date | null;
}
