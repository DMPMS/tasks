import { Expose } from "class-transformer";

export class ReturnUserDTO {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  email!: string;
}
