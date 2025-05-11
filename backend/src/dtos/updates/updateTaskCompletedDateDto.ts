import { IsOptional, Validate } from "class-validator";
import { IsCustomTimestamp } from "../../validators/isCustomTimestamp";
import { Expose } from "class-transformer";

export class UpdateTaskCompletedDateDto {
  @Expose()
  @Validate(IsCustomTimestamp)
  @IsOptional()
  completedDate!: string | null;
}
