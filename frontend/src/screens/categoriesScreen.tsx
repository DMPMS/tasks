import styles from "../styles/categoriesScreen.module.css";
import Table from "../components/table/table";
import { TableHeaderType } from "../types/TableHeaderType";
import Modal from "../components/modal/modal";
import { TableActionEnum } from "../enums/TableActionEnum";
import Navegation from "../components/navegation/navegation";
import { useCategory } from "../hooks/useCategory";

const CategoriesScreen = () => {
  const {
    loadingCategories,
    loadingRequest,
    categories,
    handleOnCreate,
    handleOnSearch,
    handleOnUpdate,
    handleOnDelete,
    openModalDelete,
    handleOnOpenModalDelete,
    handleOnCloseModalDelete,
  } = useCategory();

  const tableHeaders: TableHeaderType[] = [{ th: "Nome", td: "name" }];

  const tableActions: TableActionEnum[] = [
    TableActionEnum.Delete,
    TableActionEnum.Update,
  ];

  const tableData = categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  return loadingCategories ? (
    <div className={styles.container}>
      <span
        className={`${styles.spinner} ${styles.spinnerLoadingScreen}`}
      ></span>
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.cardCategories}>
        <Navegation />
        <h2 className={styles.h2}>Minhas Categorias</h2>
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
            Criar Categoria
          </button>
        </div>
        <Table
          data={tableData}
          headers={tableHeaders}
          actions={tableActions}
          handleOnUpdate={handleOnUpdate}
          handleOnOpenModalDelete={handleOnOpenModalDelete}
        />
      </div>

      <Modal
        title="Deseja realmente excluir essa categoria?"
        description="Ao excluir esta categoria, todas as tarefas associadas a ela ficarão sem categoria. As tarefas não serão excluídas. Esta ação será irreversível."
        isOpen={openModalDelete}
        onConfirm={handleOnDelete}
        onClose={handleOnCloseModalDelete}
        loading={loadingRequest}
      />
    </div>
  );
};

export default CategoriesScreen;
