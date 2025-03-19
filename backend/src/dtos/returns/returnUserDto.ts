import { ReturnTaskDto } from "./returnTaskDto";
import { UserEntity } from "../../entities/userEntity";

export class ReturnUserDto {
  id: number;
  name: string;
  email: string;
  
  tasks?: ReturnTaskDto[];

  constructor(userEntity: UserEntity) {
    this.id = userEntity.id;
    this.name = userEntity.name;
    this.email = userEntity.email;

    this.tasks = userEntity.tasks
      ? userEntity.tasks.map((task) => new ReturnTaskDto(task))
      : undefined;
  }
}
