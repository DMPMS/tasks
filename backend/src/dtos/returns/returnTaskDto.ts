import { ReturnUserDto } from "./returnUserDto";
import { TaskEntity } from "../../entities/taskEntity";
import { PriorityEnum } from "../../enums/PriorityEnum";
import { ReturnCategoryDto } from "./returnCategoryDto";

export class ReturnTaskDto {
  id: number;
  title: string;
  description: string;
  priority: PriorityEnum;
  completedDate: Date | null;
  limitDate: Date;

  user?: ReturnUserDto;
  category?: ReturnCategoryDto;

  constructor(taskEntity: TaskEntity) {
    this.id = taskEntity.id;
    this.title = taskEntity.title;
    this.description = taskEntity.description ? taskEntity.description : "";
    this.priority = taskEntity.priority;
    this.completedDate = taskEntity.completedDate
      ? taskEntity.completedDate
      : null;
    this.limitDate = taskEntity.limitDate;

    this.user = taskEntity.user
      ? new ReturnUserDto(taskEntity.user)
      : undefined;

    this.category = taskEntity.category
      ? new ReturnCategoryDto(taskEntity.category)
      : undefined;
  }
}
