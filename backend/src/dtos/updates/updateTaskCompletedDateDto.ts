import { IsOptional, Validate } from "class-validator";
import { IsCustomTimestamp } from "../../validators/isCustomTimestamp";

export class UpdateTaskCompletedDateDto {
  @Validate(IsCustomTimestamp)
  @IsOptional()
  completedDate!: Date | null;
}
