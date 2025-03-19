import { ReturnUserDto } from "./returnUserDto";
import { TaskEntity } from "../../entities/taskEntity";

export class ReturnTaskDto {
  id: number;
  title: string;
  description: string;
  completed: boolean;

  user?: ReturnUserDto;

  constructor(taskEntity: TaskEntity) {
    this.id = taskEntity.id;
    this.title = taskEntity.title;
    this.description = taskEntity.description ? taskEntity.description : "";
    this.completed = taskEntity.completed;

    this.user = taskEntity.user
      ? new ReturnUserDto(taskEntity.user)
      : undefined;
  }
}
