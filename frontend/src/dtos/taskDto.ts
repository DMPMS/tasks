import { PriorityEnum } from "../enums/PriorityEnum";

export interface TaskDto {
  categoryId?: number;
  title: string;
  description: string;
  priority: PriorityEnum;
  limitDate: string;
}
