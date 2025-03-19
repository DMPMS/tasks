import { Expose } from "class-transformer";

export class ReturnUserDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  email!: string;
}
