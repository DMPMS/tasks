import { RouteObject } from "react-router-dom";
import UsersScreen from "../screens/usersScreen";

export enum UserRoutesEnum {
  Users = "/user",
}

export const userRoutes: RouteObject[] = [
  {
    path: UserRoutesEnum.Users,
    element: <UsersScreen />,
  },
];
