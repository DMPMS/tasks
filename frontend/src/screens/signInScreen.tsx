import styles from "../styles/signInScreen.module.css";
import { useSignIn } from "../hooks/useSignIn";

const SignInScreen = () => {
  const {
    loadingRequest,
    disabledButton,
    invalidFields,
    handleOnChangeInput,
    handleOnSignIn,
  } = useSignIn();

  return (
    <div className={styles.container}>
      <div className={styles.cardForm}>
        <h2 className={styles.h2}>Entrar</h2>
        <form onSubmit={handleOnSignIn} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>E-mail</label>
            <input
              type="email"
              onChange={(e) => handleOnChangeInput(e, "email")}
              className={`${styles.input} ${
                invalidFields.includes("email") ? styles.invalidField : ""
              }`}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Senha</label>
            <input
              type="password"
              onChange={(e) => handleOnChangeInput(e, "password")}
              className={`${styles.input} ${
                invalidFields.includes("password") ? styles.invalidField : ""
              }`}
            />
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={disabledButton || loadingRequest}
          >
            <span className={styles.buttonContent}>
              <span>Entrar</span>
              {loadingRequest && <span className={styles.spinner}></span>}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInScreen;
