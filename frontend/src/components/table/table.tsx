import { DEFAULT_ROWS_PERS_PAGE_TABLE } from "../../config/constants";
import { TableActionEnum } from "../../enums/TableActionEnum";
import { TableHeaderType } from "../../types/TableHeaderType";
import TrashIcon from "../icons/trashIcon";
import styles from "./table.module.css";
import { useState } from "react";

interface TableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  headers: TableHeaderType[];
  actions?: TableActionEnum[];
  handleOnDelete: (id: number) => void;
}

const Table = ({ data, headers, actions, handleOnDelete }: TableProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(data.length / DEFAULT_ROWS_PERS_PAGE_TABLE);

  const renderTableData = () => {
    if (data.length === 0) {
      return (
        <tr>
          <td
            className={styles.tdEmptyData}
            colSpan={headers.length + (actions && actions.length > 0 ? 1 : 0)}
          >
            Nenhum dado encontrado.
          </td>
        </tr>
      );
    }

    const start = (currentPage - 1) * DEFAULT_ROWS_PERS_PAGE_TABLE;
    const end = start + DEFAULT_ROWS_PERS_PAGE_TABLE;

    return data.slice(start, end).map((row: typeof data, rowIndex: number) => (
      <tr key={rowIndex}>
        {headers.map((header, index) => (
          <td key={index}>{row[header.td]}</td>
        ))}
        {actions && actions.length > 0 && (
          <td>
            <div className={styles.contentTdActions}>
              {actions.includes(TableActionEnum.Delete) && (
                <TrashIcon
                  className={styles.actionItem}
                  onClick={() => handleOnDelete(row.id)}
                  width={25}
                />
              )}
            </div>
          </td>
        )}
      </tr>
    ));
  };

  const renderPagination = () => {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    ).map((page) => (
      <a
        key={page}
        href="#"
        className={page === currentPage ? styles.active : ""}
        onClick={(e) => handlePageClick(e, page)}
      >
        {page}
      </a>
    ));
  };

  const handlePageClick = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    setCurrentPage(page);
  };

  return (
    <div className={styles.containerTable}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header.th}</th>
            ))}
            {actions && actions.length > 0 && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>{renderTableData()}</tbody>
      </table>
      <div className={styles.pagination}>{renderPagination()}</div>
    </div>
  );
};

export default Table;
