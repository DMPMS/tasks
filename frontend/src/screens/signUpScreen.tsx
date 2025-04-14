import styles from "../styles/signUpScreen.module.css";
import { useSignUp } from "../hooks/useSignUp";

const SignUpScreen = () => {
  const {
    signUp,
    loadingRequest,
    disabledButton,
    warningFields,
    invalidFields,
    handleOnChangeInput,
    handleOnSignUp,
    handleOnSignIn,
    handleOnReset,
  } = useSignUp();

  return (
    <div className={styles.container}>
      <div className={styles.cardSignUp}>
        <h2 className={styles.h2}>Criar Conta</h2>
        <form onSubmit={handleOnSignUp} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Nome <span className={styles.asterisk}>*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="Nome"
              value={signUp.name}
              onChange={(e) => handleOnChangeInput(e, "name")}
              className={`${styles.field} ${
                warningFields.includes("name") ? styles.warningField : ""
              } ${invalidFields.includes("name") ? styles.invalidField : ""}`}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              E-mail <span className={styles.asterisk}>*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="seuemail@email.com"
              value={signUp.email}
              onChange={(e) => handleOnChangeInput(e, "email")}
              className={`${styles.field} ${
                warningFields.includes("email") ? styles.warningField : ""
              } ${invalidFields.includes("email") ? styles.invalidField : ""}`}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Senha <span className={styles.asterisk}>*</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={signUp.password}
              onChange={(e) => handleOnChangeInput(e, "password")}
              className={`${styles.field} ${
                warningFields.includes("password") ? styles.warningField : ""
              } ${
                invalidFields.includes("password") ? styles.invalidField : ""
              }`}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Confirmar senha <span className={styles.asterisk}>*</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={signUp.confirmPassword}
              onChange={(e) => handleOnChangeInput(e, "confirmPassword")}
              className={`${styles.field} ${
                warningFields.includes("confirmPassword")
                  ? styles.warningField
                  : ""
              } ${
                invalidFields.includes("confirmPassword")
                  ? styles.invalidField
                  : ""
              }`}
            />
          </div>

          <div className={styles.containerSignIn}>
            <a href="" onClick={handleOnSignIn} className={styles.signIn}>
              Já é cadastrado? Entrar.
            </a>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.button} ${styles.resetButton}`}
              disabled={loadingRequest}
              onClick={handleOnReset}
            >
              Resetar
            </button>

            <button
              type="submit"
              className={`${styles.button} ${styles.submitButton}`}
              disabled={disabledButton || loadingRequest}
            >
              <span className={styles.buttonContent}>
                <span>Criar Conta</span>
                {loadingRequest && <span className={styles.spinner}></span>}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpScreen;
