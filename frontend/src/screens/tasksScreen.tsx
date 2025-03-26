import styles from "../styles/tasksScreen.module.css";
import Table from "../components/table/table";
import { useTask } from "../hooks/useTask";
import { TableHeaderType } from "../types/TableHeaderType";
import Modal from "../components/modal/modal";
import { TableActionEnum } from "../enums/TableActionEnum";
import Navegation from "../components/navegation/navegation";
import { TaskStatusEnum } from "../enums/TaskStatusEnum";
import { DEFAULT_NAME_FOR_COMPLETE_TASK } from "../config/constants";
import { format } from "date-fns";
import { PriorityEnum } from "../enums/PriorityEnum";

const TaskScreen = () => {
  const {
    loadingTasks,
    loadingRequest,
    tasks,
    handleOnCreate,
    handleOnSearch,
    handleOnUpdate,
    handleOnAlterTaskStatus,
    handleOnDelete,
    openModalDelete,
    handleOnOpenModalDelete,
    handleOnCloseModalDelete,
  } = useTask();

  const tableHeaders: TableHeaderType[] = [
    { th: "Nome", td: "title" },
    { th: "Prazo", td: "limitDate" },
    { th: "Status", td: DEFAULT_NAME_FOR_COMPLETE_TASK, hideAtWith: 700 },
    { th: "Prioridade", td: "priority", hideAtWith: 800 },
    { th: "Categoria", td: "category", hideAtWith: 900 },
  ];

  const tableActions: TableActionEnum[] = [
    TableActionEnum.Delete,
    TableActionEnum.Update,
    TableActionEnum.CompleteTask,
  ];

  const tableData = tasks.map((task) => ({
    id: task.id,
    completedDate: task.completedDate,
    taskStatus: task.completedDate
      ? TaskStatusEnum.Completed
      : new Date(task.limitDate) < new Date()
      ? TaskStatusEnum.Overdue
      : TaskStatusEnum.Pending,
    priority:
      task.priority === PriorityEnum.High
        ? "Alta"
        : task.priority === PriorityEnum.Medium
        ? "Média"
        : "Baixa",
    title: task.title,
    limitDate: format(task.limitDate, "dd/MM/yyyy 'às' HH:mm"),
    category: task.category?.name,
  }));

  return loadingTasks ? (
    <div className={styles.container}>
      <span
        className={`${styles.spinner} ${styles.spinnerLoadingScreen}`}
      ></span>
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.cardTasks}>
        <Navegation />
        <h2 className={styles.h2}>Minhas Tarefas</h2>
        <div className={styles.containerSearchAndCreate}>
          <input
            type="text"
            placeholder="Buscar"
            onChange={(e) => handleOnSearch(e.target.value)}
            className={styles.input}
          />
          <button
            type="button"
            onClick={handleOnCreate}
            className={styles.button}
          >
            Criar Tarefa
          </button>
        </div>
        <Table
          data={tableData}
          headers={tableHeaders}
          actions={tableActions}
          handleOnUpdate={handleOnUpdate}
          handleOnOpenModalDelete={handleOnOpenModalDelete}
          handleOnAlterTaskStatus={handleOnAlterTaskStatus}
        />
      </div>

      <Modal
        title="Deseja realmente excluir essa tarefa?"
        description="Esta ação será irreversível."
        isOpen={openModalDelete}
        onConfirm={handleOnDelete}
        onClose={handleOnCloseModalDelete}
        loading={loadingRequest}
      />
    </div>
  );
};

export default TaskScreen;
