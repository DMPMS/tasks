import { RouteObject } from "react-router-dom";
import TasksScreen from "../screens/tasksScreen";

export enum TaskRoutesEnum {
  Tasks = "/task",
}

export const taskRoutes: RouteObject[] = [
  {
    path: TaskRoutesEnum.Tasks,
    element: <TasksScreen />,
  },
];
