import { ReturnTaskDto } from "./returnTaskDto";
import { UserEntity } from "../../entities/userEntity";
import { ReturnCategoryDto } from "./returnCategoryDto";

export class ReturnUserDto {
  id: number;
  name: string;
  email: string;

  tasks?: ReturnTaskDto[];
  categories?: ReturnCategoryDto[];

  constructor(userEntity: UserEntity) {
    this.id = userEntity.id;
    this.name = userEntity.name;
    this.email = userEntity.email;

    this.tasks = userEntity.tasks
      ? userEntity.tasks.map((task) => new ReturnTaskDto(task))
      : undefined;

    this.categories = userEntity.categories
      ? userEntity.categories.map((category) => new ReturnCategoryDto(category))
      : undefined;
  }
}
