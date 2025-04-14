import Navegation from "../components/navegation/navegation";
import { useUpdateUser } from "../hooks/useUpdateUser";
import styles from "../styles/updateUserScreen.module.css";

const UpdateUserScreen = () => {
  const {
    user,
    loadingUser,
    loadingRequest,
    disabledButton,
    invalidFields,
    handleOnChangeInput,
    handleOnUpdate,
    handleOnReset,
  } = useUpdateUser();

  return loadingUser ? (
    <div className={styles.container}>
      <span
        className={`${styles.spinner} ${styles.spinnerLoadingScreen}`}
      ></span>
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.cardUpdateUser}>
        <Navegation />
        <h2 className={styles.h2}>Editar Usuário</h2>
        <form onSubmit={handleOnUpdate} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Nome <span className={styles.asterisk}>*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="Nome"
              value={user.name}
              onChange={(e) => handleOnChangeInput(e, "name")}
              className={`${styles.field} ${
                invalidFields.includes("name") ? styles.invalidField : ""
              }`}
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
              value={user.email}
              onChange={(e) => handleOnChangeInput(e, "email")}
              className={`${styles.field} ${
                invalidFields.includes("email") ? styles.invalidField : ""
              }`}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Nova senha</label>
            <input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              value={user.newPassword}
              onChange={(e) => handleOnChangeInput(e, "newPassword")}
              className={`${styles.field} ${
                invalidFields.includes("newPassword") ? styles.invalidField : ""
              }`}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Confirmar nova senha
              {user.newPassword && <span className={styles.asterisk}> *</span>}
            </label>
            <input
              id="confirmNewPassword"
              type="password"
              placeholder={
                user.newPassword ? "••••••••" : "Digite a nova senha"
              }
              value={user.confirmNewPassword}
              onChange={(e) => handleOnChangeInput(e, "confirmNewPassword")}
              className={`${styles.field} ${
                invalidFields.includes("confirmNewPassword")
                  ? styles.invalidField
                  : ""
              }`}
              disabled={user.newPassword ? false : true}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Senha atual<span className={styles.asterisk}>*</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={user.password}
              onChange={(e) => handleOnChangeInput(e, "password")}
              className={`${styles.field} ${
                invalidFields.includes("password") ? styles.invalidField : ""
              }`}
            />
          </div>

          <div className={styles.actions}>
            <div className={styles.containerDeleteAndCancel}>
              <button
                type="button"
                className={`${styles.button} ${styles.deleteButton}`}
                disabled={loadingRequest}
                // onClick={handleOnCancel}
              >
                Deletar usuário
              </button>

              <button
                type="button"
                className={`${styles.button} ${styles.resetButton}`}
                disabled={loadingRequest}
                onClick={handleOnReset}
              >
                Resetar
              </button>
            </div>

            <button
              type="submit"
              className={`${styles.button} ${styles.submitButton}`}
              disabled={disabledButton || loadingRequest}
            >
              <span className={styles.buttonContent}>
                <span>Salvar</span>
                {loadingRequest && <span className={styles.spinner}></span>}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserScreen;
