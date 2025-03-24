import { TaskType } from "./TaskType";
import { UserType } from "./UserType";

export interface CategoryType {
  id: number;
  name: string;

  user?: UserType;
  tasks?: TaskType[];
}
