import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Validate,
} from "class-validator";
import { TASK } from "../../config/constants";
import { PriorityEnum } from "../../enums/PriorityEnum";
import { IsCustomTimestamp } from "../../validators/isCustomTimestamp";

export class CreateTaskDto {
  @IsString()
  @Length(TASK.TITLE_LENGTH.MIN, TASK.TITLE_LENGTH.MAX)
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PriorityEnum)
  priority!: PriorityEnum;

  @Validate(IsCustomTimestamp)
  limitDate!: Date;
}
