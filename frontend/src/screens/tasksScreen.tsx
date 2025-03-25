import styles from "../styles/taskScreen.module.css";
import Table from "../components/table/table";
import { useTask } from "../hooks/useTask";
import { TableHeaderType } from "../types/TableHeaderType";
import Modal from "../components/modal/modal";
import { TableActionEnum } from "../enums/TableActionEnum";

const TaskScreen = () => {
  const {
    loadingTasks,
    loadingRequest,
    tasks,
    handleOnCreate,
    handleOnSearch,
    handleOnUpdate,
    handleOnDelete,
    openModalDelete,
    handleOnOpenModalDelete,
    handleOnCloseModalDelete,
  } = useTask();

  const tableHeaders: TableHeaderType[] = [
    { th: "Nome", td: "title" },
    { th: "Prazo", td: "limitDate" },
    { th: "Categoria", td: "category" },
  ];

  const tableActions: TableActionEnum[] = [
    TableActionEnum.Delete,
    TableActionEnum.Update,
  ];

  const tableData = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    limitDate:
      new Date(task.limitDate).toLocaleDateString("pt-BR") +
      " às " +
      new Date(task.limitDate).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    category: task.category?.name,
  }));

  return (
    <div className={styles.container}>
      {loadingTasks ? (
        <span
          className={`${styles.spinner} ${styles.spinnerLoadingScreen}`}
        ></span>
      ) : (
        <div className={styles.cardTasks}>
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
          />

          <Modal
            title="Deseja realmente excluir essa tarefa?"
            description="Esta ação será irreversível."
            isOpen={openModalDelete}
            onConfirm={handleOnDelete}
            onClose={handleOnCloseModalDelete}
            loading={loadingRequest}
          />
        </div>
      )}
    </div>
  );
};

export default TaskScreen;
