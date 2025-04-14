import { useParams } from "react-router-dom";
import styles from "../styles/createCategoryScreen.module.css";
import Navegation from "../components/navegation/navegation";
import { useCreateCategory } from "../hooks/useCreateCategory";

const CreateCategoryScreen = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  const {
    category,
    loadingCategory,
    loadingRequest,
    disabledButton,
    isEdit,
    warningFields,
    invalidFields,
    handleOnChangeInput,
    handleOnCreate,
    handleOnCancel,
    handleOnReset,
  } = useCreateCategory(categoryId);

  return loadingCategory ? (
    <div className={styles.container}>
      <span
        className={`${styles.spinner} ${styles.spinnerLoadingScreen}`}
      ></span>
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.cardCreateCategory}>
        <Navegation />
        <h2 className={styles.h2}>
          {isEdit ? "Editar Categoria" : "Criar Categoria"}
        </h2>
        <form onSubmit={handleOnCreate} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Nome <span className={styles.asterisk}>*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="Nome"
              value={category.name}
              onChange={(e) => handleOnChangeInput(e, "name")}
              className={`${styles.field} ${
                warningFields.includes("name") ? styles.warningField : ""
              } ${invalidFields.includes("name") ? styles.invalidField : ""}`}
            />
          </div>

          <div className={styles.actions}>
            <div className={styles.containerResetAndCancel}>
              <button
                type="button"
                className={`${styles.button} ${styles.cancelButton}`}
                disabled={loadingRequest}
                onClick={handleOnCancel}
              >
                Cancelar
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
                <span>{isEdit ? "Salvar" : "Criar"}</span>
                {loadingRequest && <span className={styles.spinner}></span>}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryScreen;
