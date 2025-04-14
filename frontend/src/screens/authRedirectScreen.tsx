import { useNavigate } from "react-router-dom";
import styles from "../styles/authRedirectScreen.module.css";
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
import { NotificationEnum } from "../enums/NotificationEnum";
import { ERROR_MESSAGES } from "../utils/messages";

const AuthRedirectScreen = () => {
  const { user, setNotification } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAuthorizationToken();
    if (!token) {
      navigate(SignInRoutesEnum.SignIn);
    } else if (!isValidToken(token)) {
      unsetAuthorizationToken();
      navigate(SignInRoutesEnum.SignIn);
    } else {
      const decodedToken = jwtDecode<TokenType>(token.split(" ")[1]);
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
        setNotification({
          message: ERROR_MESSAGES.TOKEN_USER_TYPE_ROOT,
          type: NotificationEnum.Error,
        });
        navigate(SignInRoutesEnum.SignIn);
      }
    }
  }, [user]);

  return (
    <div className={styles.container}>
      <span
        className={`${styles.spinner} ${styles.spinnerLoadingScreen}`}
      ></span>
    </div>
  );
};

export default AuthRedirectScreen;
