import { useNavigate } from "react-router-dom";
import TaskIcon from "../icons/taskIcon";
import styles from "./navegation.module.css";
import { TaskRoutesEnum } from "../../routes/taskRoutes";
import ExitIcon from "../icons/exitIcon";
import { logout } from "../../utils/functions/auth";
import CategoryIcon from "../icons/categoryIcon";
import { CategoryRoutesEnum } from "../../routes/categoryRoutes";

const Navegation = () => {
  const navigate = useNavigate();

  const handleOnTasks = () => {
    navigate(TaskRoutesEnum.Tasks);
  };

  const handleOnCategories = () => {
    navigate(CategoryRoutesEnum.Categories);
  };

  const handleOnLogout = () => {
    logout(navigate);
  };

  return (
    <div className={styles.cardNavegation}>
      <TaskIcon onClick={handleOnTasks} width={35} />
      <CategoryIcon onClick={handleOnCategories} width={35} />
      <ExitIcon onClick={handleOnLogout} width={35} />
    </div>
  );
};

export default Navegation;
