import { RouteObject } from "react-router-dom";
import SignUpScreen from "../screens/signUpScreen";

export enum SignUpRoutesEnum {
  SIGN_UP = "/sign-up",
}

export const signUpRoutes: RouteObject[] = [
  {
    path: SignUpRoutesEnum.SIGN_UP,
    element: <SignUpScreen />,
  },
];
