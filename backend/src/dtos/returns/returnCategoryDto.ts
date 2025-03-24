import { ReturnUserDto } from "./returnUserDto";
import { ReturnTaskDto } from "./returnTaskDto";
import { CategoryEntity } from "../../entities/categoryEntity";

export class ReturnCategoryDto {
  id: number;
  name: string;

  user?: ReturnUserDto;
  tasks?: ReturnTaskDto[];

  constructor(categoryEntity: CategoryEntity) {
    this.id = categoryEntity.id;
    this.name = categoryEntity.name;

    this.user = categoryEntity.user
      ? new ReturnUserDto(categoryEntity.user)
      : undefined;

    this.tasks = categoryEntity.tasks
      ? categoryEntity.tasks.map((task) => new ReturnTaskDto(task))
      : undefined;
  }
}
