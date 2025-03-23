import { RouteObject } from "react-router-dom";
import AuthRedirectScreen from "../screens/authRedirectScreen";

export enum AuthRedirectRoutesEnum {
  AuthRedirect = "/",
}

export const authRedirectRoutes: RouteObject[] = [
  {
    path: AuthRedirectRoutesEnum.AuthRedirect,
    element: <AuthRedirectScreen />,
  },
];
