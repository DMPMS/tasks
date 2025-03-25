import { RouteObject } from "react-router-dom";
import TasksScreen from "../screens/tasksScreen";
import CreateTaskScreen from "../screens/createTaskScreen";

export enum TaskRoutesEnum {
  Tasks = "/task",
  CreateTask = "/task/create",
  UpdateTask = "/task/:taskId",
}

export const taskRoutes: RouteObject[] = [
  {
    path: TaskRoutesEnum.Tasks,
    element: <TasksScreen />,
  },
  {
    path: TaskRoutesEnum.CreateTask,
    element: <CreateTaskScreen />,
  },
  {
    path: TaskRoutesEnum.UpdateTask,
    element: <CreateTaskScreen />,
  },
];
