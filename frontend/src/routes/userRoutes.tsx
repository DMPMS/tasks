import { RouteObject } from "react-router-dom";
import UsersScreen from "../screens/usersScreen";
import UpdateUserScreen from "../screens/updateUserScreen";

export enum UserRoutesEnum {
  Users = "/user",
  UpdateUser = "/user/update",
}

export const userRoutes: RouteObject[] = [
  {
    path: UserRoutesEnum.Users,
    element: <UsersScreen />,
  },
  {
    path: UserRoutesEnum.UpdateUser,
    element: <UpdateUserScreen />,
  },
];
