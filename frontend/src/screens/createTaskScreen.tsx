import { PriorityEnum } from "../enums/PriorityEnum";
import { useCreateTask } from "../hooks/useCreateTask";
import styles from "../styles/createTaskScreen.module.css";

const CreateTaskScreen = () => {
  const {
    task,
    loadingRequest,
    disabledButton,
    invalidFields,
    warningFields,
    handleOnChangeInput,
    handleOnChangeTextArea,
    handleOnChangePrioritySelect,
    handleOnPreSubmit,
    handleOnCreate,
    handleOnCancel,
    handleOnReset,
  } = useCreateTask();

  return (
    <div className={styles.container}>
      <div className={styles.cardCreateTask}>
        <h2 className={styles.h2}>Criar Tarefa</h2>
        <form onSubmit={handleOnCreate} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Título <span className={styles.asterisk}>*</span>
            </label>
            <input
              type="text"
              value={task.title}
              onChange={(e) => handleOnChangeInput(e, "title")}
              className={`${styles.field} ${
                invalidFields.includes("title") ? styles.invalidField : ""
              }`}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Descrição</label>
            <textarea
              value={task.description}
              onChange={(e) => handleOnChangeTextArea(e, "description")}
              className={`${styles.field} ${
                invalidFields.includes("description") ? styles.invalidField : ""
              } ${styles.textarea}`}
              rows={5}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Prazo <span className={styles.asterisk}>*</span>
            </label>
            <input
              id="limitDate"
              type="datetime-local"
              value={task.limitDate}
              onChange={(e) => handleOnChangeInput(e, "limitDate")}
              className={`${styles.field} ${
                warningFields.includes("limitDate") ? styles.warningField : ""
              }`}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Prioridade <span className={styles.asterisk}>*</span>
            </label>
            <select
              value={task.priority}
              onChange={(e) => handleOnChangePrioritySelect(e)}
              className={`${styles.field} ${
                invalidFields.includes("priority") ? styles.invalidField : ""
              }`}
            >
              <option value={PriorityEnum.High}>Alta</option>
              <option value={PriorityEnum.Medium}>Média</option>
              <option value={PriorityEnum.Low}>Baixa</option>
            </select>
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
              onClick={handleOnPreSubmit}
            >
              <span className={styles.buttonContent}>
                <span>Criar</span>
                {loadingRequest && <span className={styles.spinner}></span>}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskScreen;
