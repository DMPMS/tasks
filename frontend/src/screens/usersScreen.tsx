import styles from "../styles/usersScreen.module.css";
import { TableActionEnum } from "../enums/TableActionEnum";
import { useUser } from "../hooks/useUser";
import { TableHeaderType } from "../types/TableHeaderType";
import Navegation from "../components/navegation/navegation";
import Table from "../components/table/table";
import Modal from "../components/modal/modal";
import { TableHideLevelEnum } from "../enums/TableHideLevelEnum";

const UsersScreen = () => {
  const {
    loadingUsers,
    loadingRequest,
    users,
    handleOnSearch,
    handleOnDelete,
    openModalDelete,
    handleOnOpenModalDelete,
    handleOnCloseModalDelete,
  } = useUser();

  const tableHeaders: TableHeaderType[] = [
    { th: "Nome", td: "name" },
    { th: "E-mail", td: "email", hideAtWith: TableHideLevelEnum.Medium },
  ];

  const tableActions: TableActionEnum[] = [TableActionEnum.Delete];

  const tableData = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));

  return loadingUsers ? (
    <div className={styles.container}>
      <span
        className={`${styles.spinner} ${styles.spinnerLoadingScreen}`}
      ></span>
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.cardUsers}>
        <Navegation />
        <h2 className={styles.h2}>Usuários</h2>
        <div className={styles.containerSearch}>
          <input
            type="text"
            placeholder="Buscar"
            onChange={(e) => handleOnSearch(e.target.value)}
            className={styles.input}
          />
        </div>
        <Table
          data={tableData}
          headers={tableHeaders}
          actions={tableActions}
          handleOnOpenModalDelete={handleOnOpenModalDelete}
        />
      </div>

      <Modal
        title="Deseja realmente excluir esse usuário?"
        description="Todas as tarefas e categorias desse usuário também serão excluídas. Esta ação será irreversível."
        isOpen={openModalDelete}
        onConfirm={handleOnDelete}
        onClose={handleOnCloseModalDelete}
        loading={loadingRequest}
      />
    </div>
  );
};

export default UsersScreen;
