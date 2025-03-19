import { Expose } from "class-transformer";
import { ReturnUserDto } from "./returnUserDto";

export class ReturnLoginDto {
  @Expose()
  user!: ReturnUserDto;

  @Expose()
  token!: string;
}
