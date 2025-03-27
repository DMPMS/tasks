import { useNavigate } from "react-router-dom";
import TaskIcon from "../icons/taskIcon";
import styles from "./navegation.module.css";
import { TaskRoutesEnum } from "../../routes/taskRoutes";
import ExitIcon from "../icons/exitIcon";
import { getAuthorizationToken, logout } from "../../utils/functions/auth";
import CategoryIcon from "../icons/categoryIcon";
import { CategoryRoutesEnum } from "../../routes/categoryRoutes";
import { useGlobalReducer } from "../../store/reducers/globalReducer/useGlobalReducer";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { TokenType } from "../../types/TokenType";
import { UserTypeEnum } from "../../enums/UserTypeEnum";
import UserIcon from "../icons/userIcon";
import { UserRoutesEnum } from "../../routes/userRoutes";

const Navegation = () => {
  const { user } = useGlobalReducer();

  const [userType, setUserType] = useState<UserTypeEnum | undefined>(undefined);

  useEffect(() => {
    const token = getAuthorizationToken();

    const decodedToken = jwtDecode<TokenType>(token!);

    setUserType(decodedToken.userType);
  }, [user]);

  const navigate = useNavigate();

  const handleOnTasks = () => {
    navigate(TaskRoutesEnum.Tasks);
  };

  const handleOnCategories = () => {
    navigate(CategoryRoutesEnum.Categories);
  };

  const handleOnUsers = () => {
    navigate(UserRoutesEnum.Users);
  };

  const handleOnLogout = () => {
    logout(navigate);
  };

  return (
    <div className={styles.cardNavegation}>
      {userType === UserTypeEnum.User && (
        <TaskIcon onClick={handleOnTasks} width={35} />
      )}
      {userType === UserTypeEnum.User && (
        <CategoryIcon onClick={handleOnCategories} width={35} />
      )}
      {userType === UserTypeEnum.Admin && (
        <UserIcon onClick={handleOnUsers} width={35} />
      )}
      <ExitIcon onClick={handleOnLogout} width={35} />
    </div>
  );
};

export default Navegation;
