import { LoaderFunction, NavigateFunction, redirect } from "react-router-dom";
import { AUTHORIZATION_KEY } from "../../config/constants";
import { UserTypeEnum } from "../../enums/UserTypeEnum";
import { getItemStorage, removeItemStorage, setItemStorage } from "./storage";
import { SignInRoutesEnum } from "../../routes/signInRoutes";
import { jwtDecode } from "jwt-decode";
import { TokenType } from "../../types/TokenType";

export const unsetAuthorizationToken = () => {
  removeItemStorage(AUTHORIZATION_KEY);
};

export const setAuthorizationToken = (token?: string) => {
  if (token) {
    setItemStorage(AUTHORIZATION_KEY, token);
  }
};

export const getAuthorizationToken = () => {
  return getItemStorage(AUTHORIZATION_KEY);
};

export const isValidToken = (token: string): boolean => {
  try {
    jwtDecode<TokenType>(token);
    return true;
  } catch {
    return false;
  }
};

export const verifyLoggedIn = (userType?: UserTypeEnum): LoaderFunction => {
  return async () => {
    const token = getAuthorizationToken();
    if (!token) {
      return redirect(SignInRoutesEnum.SIGN_IN);
    }

    if (!isValidToken(token)) {
      unsetAuthorizationToken();
      return redirect(SignInRoutesEnum.SIGN_IN);
    }

    const decodedToken = jwtDecode<TokenType>(token);

    if (userType && decodedToken.userType !== userType) {
      unsetAuthorizationToken();
      return redirect(SignInRoutesEnum.SIGN_IN);
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      unsetAuthorizationToken();
      return redirect(SignInRoutesEnum.SIGN_IN);
    }

    return null;
  };
};

export const logout = (navigate: NavigateFunction) => {
  unsetAuthorizationToken();
  navigate(SignInRoutesEnum.SIGN_IN);
};
