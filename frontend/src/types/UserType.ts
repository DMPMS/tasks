import { CategoryType } from "./CategoryType";
import { TaskType } from "./TaskType";

export interface UserType {
  id: number;
  name: string;
  email: string;

  tasks?: TaskType[];
  categories?: CategoryType[];
}
