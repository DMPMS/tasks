import { UserType } from "./UserType";

export interface TaskType {
  id: number;
  title: string;
  description: string;
  completed: boolean;

  user?: UserType;
}
