import { PriorityEnum } from "../enums/PriorityEnum";

export interface CreateTaskDto {
  categoryId?: number;
  title: string;
  description: string;
  priority: PriorityEnum;
  limitDate: string;
}
