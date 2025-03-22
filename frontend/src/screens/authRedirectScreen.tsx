import { useNavigate } from "react-router-dom";
import { useGlobalReducer } from "../store/reducers/globalReducer/useGlobalReducer";
import { useEffect } from "react";
import {
  getAuthorizationToken,
  isValidToken,
  unsetAuthorizationToken,
} from "../utils/functions/auth";
import { SignInRoutesEnum } from "../routes/signInRoutes";
import { jwtDecode } from "jwt-decode";
import { TokenType } from "../types/TokenType";
import { UserTypeEnum } from "../enums/UserTypeEnum";
import { UserRoutesEnum } from "../routes/userRoutes";
import { TaskRoutesEnum } from "../routes/taskRoutes";

const AuthRedirectScreen = () => {
  const { user } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAuthorizationToken();
    if (!token) {
      navigate(SignInRoutesEnum.SIGN_IN);
    } else if (!isValidToken(token)) {
      unsetAuthorizationToken();
      navigate(SignInRoutesEnum.SIGN_IN);
    } else {
      const decodedToken = jwtDecode<TokenType>(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp && decodedToken.exp < currentTime) {
        unsetAuthorizationToken();
        navigate(SignInRoutesEnum.SIGN_IN);
      } else if (decodedToken.userType === UserTypeEnum.USER) {
        navigate(TaskRoutesEnum.TASKS);
      } else if (decodedToken.userType === UserTypeEnum.ADMIN) {
        navigate(UserRoutesEnum.USERS);
      } else {
        unsetAuthorizationToken();
        navigate(SignInRoutesEnum.SIGN_IN);
      }
    }
  }, [user]);

  return <div>Auth Redirect</div>;
};

export default AuthRedirectScreen;
