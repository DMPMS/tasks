import { RouteObject } from "react-router-dom";
import SignUpScreen from "../screens/signUpScreen";

export enum SignUpRoutesEnum {
  SignUp = "/sign-up",
}

export const signUpRoutes: RouteObject[] = [
  {
    path: SignUpRoutesEnum.SignUp,
    element: <SignUpScreen />,
  },
];
