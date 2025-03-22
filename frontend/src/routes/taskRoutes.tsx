import { RouteObject } from "react-router-dom";
import TasksScreen from "../screens/tasksScreen";

export enum TaskRoutesEnum {
  TASKS = "/tasks",
}

export const taskRoutes: RouteObject[] = [
  {
    path: TaskRoutesEnum.TASKS,
    element: <TasksScreen />,
  },
];
