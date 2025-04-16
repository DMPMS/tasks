import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class DeleteUserDto {
  @Expose()
  @IsString()
  password!: string;
}
