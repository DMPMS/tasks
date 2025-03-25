import styles from "../styles/notFoundScreen.module.css";
import { useNotFound } from "../hooks/useNotFound";

const NotFoundScreen = () => {
  const { handleOnClickButton } = useNotFound();

  return (
    <div className={styles.container}>
      <div className={styles.cardNotFound}>
        <h2 className={styles.h2}>Erro 404</h2>
        <text className={styles.text}>Página não encontrada</text>
        <button
          type="button"
          onClick={handleOnClickButton}
          className={styles.button}
        >
          Página de login
        </button>
      </div>
    </div>
  );
};

export default NotFoundScreen;
