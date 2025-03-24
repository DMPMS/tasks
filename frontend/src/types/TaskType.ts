import { PriorityEnum } from "../enums/PriorityEnum";
import { CategoryType } from "./CategoryType";
import { UserType } from "./UserType";

export interface TaskType {
  id: number;
  title: string;
  description: string;
  priority: PriorityEnum;
  completedDate?: Date;
  limitDate: Date;

  user?: UserType;
  category?: CategoryType;
}
