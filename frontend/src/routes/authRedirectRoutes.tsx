import { RouteObject } from "react-router-dom";
import AuthRedirectScreen from "../screens/authRedirectScreen";

export enum AuthRedirectRoutesEnum {
  AUTH_REDIRECT = "/",
}

export const authRedirectRoutes: RouteObject[] = [
  {
    path: AuthRedirectRoutesEnum.AUTH_REDIRECT,
    element: <AuthRedirectScreen />,
  },
];
