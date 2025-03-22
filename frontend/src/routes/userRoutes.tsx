import { RouteObject } from "react-router-dom";
import UsersScreen from "../screens/usersScreen";

export enum UserRoutesEnum {
  USERS = "/users",
}

export const userRoutes: RouteObject[] = [
  {
    path: UserRoutesEnum.USERS,
    element: <UsersScreen />,
  },
];
