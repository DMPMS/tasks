import { RouteObject } from "react-router-dom";
import SignInScreen from "../screens/signInScreen";

export enum SignInRoutesEnum {
  SignIn = "/sign-in",
}

export const signInRoutes: RouteObject[] = [
  {
    path: SignInRoutesEnum.SignIn,
    element: <SignInScreen />,
  },
];
