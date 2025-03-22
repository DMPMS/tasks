import { RouteObject } from "react-router-dom";
import SignInScreen from "../screens/signInScreen";

export enum SignInRoutesEnum {
  SIGN_IN = "/sign-in",
}

export const signInRoutes: RouteObject[] = [
  {
    path: SignInRoutesEnum.SIGN_IN,
    element: <SignInScreen />,
  },
];
