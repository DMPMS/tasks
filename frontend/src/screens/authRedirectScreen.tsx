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
      navigate(SignInRoutesEnum.SignIn);
    } else if (!isValidToken(token)) {
      unsetAuthorizationToken();
      navigate(SignInRoutesEnum.SignIn);
    } else {
      const decodedToken = jwtDecode<TokenType>(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp && decodedToken.exp < currentTime) {
        unsetAuthorizationToken();
        navigate(SignInRoutesEnum.SignIn);
      } else if (decodedToken.userType === UserTypeEnum.User) {
        navigate(TaskRoutesEnum.Tasks);
      } else if (decodedToken.userType === UserTypeEnum.Admin) {
        navigate(UserRoutesEnum.Users);
      } else {
        unsetAuthorizationToken();
        navigate(SignInRoutesEnum.SignIn);
      }
    }
  }, [user]);

  return <div>Auth Redirect</div>;
};

export default AuthRedirectScreen;
