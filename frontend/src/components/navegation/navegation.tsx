import { useNavigate } from "react-router-dom";
import styles from "./navegation.module.css";
import { TaskRoutesEnum } from "../../routes/taskRoutes";
import ExitIcon from "../icon/svgs/exitIcon";
import { getAuthorizationToken, logout } from "../../utils/functions/auth";
import CategoryIcon from "../icon/svgs/categoryIcon";
import { CategoryRoutesEnum } from "../../routes/categoryRoutes";
import { useGlobalReducer } from "../../store/reducers/globalReducer/useGlobalReducer";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { TokenType } from "../../types/TokenType";
import { UserTypeEnum } from "../../enums/UserTypeEnum";
import UserIcon from "../icon/svgs/userIcon";
import { UserRoutesEnum } from "../../routes/userRoutes";
import Icon from "../icon/icon";
import TaskIcon from "../icon/svgs/taskIcon";

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
        <Icon
          width={20}
          backgroundColor="var(--color-blue-1)"
          backgroundHoveredColor="var(--color-blue-2)"
          title="Minhas Tarefas"
          onClick={handleOnTasks}
        >
          <TaskIcon />
        </Icon>
      )}
      {userType === UserTypeEnum.User && (
        <Icon
          width={20}
          backgroundColor="var(--color-blue-1)"
          backgroundHoveredColor="var(--color-blue-2)"
          title="Minhas Categorias"
          onClick={handleOnCategories}
        >
          <CategoryIcon />
        </Icon>
      )}
      {userType === UserTypeEnum.Admin && (
        <Icon
          width={20}
          backgroundColor="var(--color-blue-1)"
          backgroundHoveredColor="var(--color-blue-2)"
          title="Usuários"
          onClick={handleOnUsers}
        >
          <UserIcon />
        </Icon>
      )}
      <Icon
        width={20}
        backgroundColor="var(--color-red-1)"
        backgroundHoveredColor="var(--color-red-2)"
        title="Sair"
        onClick={handleOnLogout}
      >
        <ExitIcon />
      </Icon>
    </div>
  );
};

export default Navegation;
