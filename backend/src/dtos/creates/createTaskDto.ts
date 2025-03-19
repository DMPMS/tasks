import { IsOptional, IsString, Length } from "class-validator";
import { TASK } from "../../config/constants";

export class CreateTaskDto {
  @IsString()
  @Length(TASK.TITLE_LENGTH.MIN, TASK.TITLE_LENGTH.MAX)
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
