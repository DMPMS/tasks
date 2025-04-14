import { useParams } from "react-router-dom";
import { PriorityEnum } from "../enums/PriorityEnum";
import { useCreateTask } from "../hooks/useCreateTask";
import styles from "../styles/createTaskScreen.module.css";
import Navegation from "../components/navegation/navegation";

const CreateTaskScreen = () => {
  const { taskId } = useParams<{ taskId: string }>();

  const {
    task,
    loadingTask,
    loadingRequest,
    disabledButton,
    isEdit,
    warningFields,
    invalidFields,
    categories,
    handleOnChangeInput,
    handleOnChangeTextArea,
    handleOnChangeCategorySelect,
    handleOnChangePrioritySelect,
    handleOnPreSubmit,
    handleOnCreate,
    handleOnCancel,
    handleOnReset,
  } = useCreateTask(taskId);

  return loadingTask ? (
    <div className={styles.container}>
      <span
        className={`${styles.spinner} ${styles.spinnerLoadingScreen}`}
      ></span>
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.cardCreateTask}>
        <Navegation />
        <h2 className={styles.h2}>
          {isEdit ? "Editar Tarefa" : "Criar Tarefa"}
        </h2>
        <form onSubmit={handleOnCreate} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Título <span className={styles.asterisk}>*</span>
            </label>
            <input
              id="title"
              type="text"
              placeholder="Título"
              value={task.title}
              onChange={(e) => handleOnChangeInput(e, "title")}
              className={`${styles.field} ${
                warningFields.includes("title") ? styles.warningField : ""
              } ${invalidFields.includes("title") ? styles.invalidField : ""}`}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Descrição</label>
            <textarea
              id="description"
              value={task.description}
              onChange={(e) => handleOnChangeTextArea(e, "description")}
              className={`${styles.field} ${
                warningFields.includes("description") ? styles.warningField : ""
              } ${
                invalidFields.includes("description") ? styles.invalidField : ""
              }`}
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
              } ${
                invalidFields.includes("limitDate") ? styles.invalidField : ""
              }`}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Categoria</label>
            <select
              id="categoryId"
              value={task.categoryId === undefined ? "" : task.categoryId}
              onChange={(e) => handleOnChangeCategorySelect(e)}
              className={`${styles.field} ${
                warningFields.includes("categoryId") ? styles.warningField : ""
              } ${
                invalidFields.includes("categoryId") ? styles.invalidField : ""
              } ${task.categoryId ? styles.fontNormal : styles.fontItalic}`}
              disabled={categories.length === 0}
            >
              <option value="" className={styles.fontItalic}>
                Nenhuma
              </option>
              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                  className={styles.fontNormal}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Prioridade <span className={styles.asterisk}>*</span>
            </label>
            <select
              id="priority"
              value={task.priority}
              onChange={(e) => handleOnChangePrioritySelect(e)}
              className={`${styles.field} ${
                warningFields.includes("priority") ? styles.warningField : ""
              } ${
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

export default CreateTaskScreen;
