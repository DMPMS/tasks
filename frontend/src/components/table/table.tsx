import { format } from "date-fns";
import {
  DATETIME_FORMAT,
  DEFAULT_NAME_FOR_COMPLETE_TASK,
  PAGINATION,
} from "../../config/constants";
import { TableActionEnum } from "../../enums/TableActionEnum";
import { TaskStatusEnum } from "../../enums/TaskStatusEnum";
import { TableHeaderType } from "../../types/TableHeaderType";
import CompletedIcon from "../icons/completedIcon";
import OverdueIcon from "../icons/overdueIcon";
import PencilIcon from "../icons/pencilIcon";
import PendingIcon from "../icons/pendingIcon";
import TrashIcon from "../icons/trashIcon";
import styles from "./table.module.css";
import { useState } from "react";
import { TableHideLevelEnum } from "../../enums/TableHideLevelEnum";

interface TableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  headers: TableHeaderType[];
  actions?: TableActionEnum[];
  handleOnUpdate: (id: number) => void;
  handleOnOpenModalDelete: (id: number) => void;
  handleOnAlterTaskStatus?: (id: number, status: TaskStatusEnum) => void;
}

const Table = ({
  data,
  headers,
  actions,
  handleOnUpdate,
  handleOnOpenModalDelete,
  handleOnAlterTaskStatus,
}: TableProps) => {
  const [currentPage, setCurrentPage] = useState<number>(
    PAGINATION.DEFAULT_PAGE
  );

  const totalPages = Math.ceil(data.length / PAGINATION.DEFAULT_LIMIT);

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

    const start =
      (currentPage - PAGINATION.INITIAL_PAGE) * PAGINATION.DEFAULT_LIMIT;
    const end = start + PAGINATION.DEFAULT_LIMIT;

    return data.slice(start, end).map((row: typeof data, rowIndex: number) => (
      <tr key={rowIndex}>
        {headers.map((header, index) => (
          <td
            key={index}
            title={
              row[header.td] === TaskStatusEnum.Completed
                ? String(format(row.completedDate, DATETIME_FORMAT.SHOW))
                : ""
            }
            className={`${
              row[header.td] === TaskStatusEnum.Pending
                ? styles.pending
                : row[header.td] === TaskStatusEnum.Completed
                ? styles.completed
                : row[header.td] === TaskStatusEnum.Overdue
                ? styles.overdue
                : ""
            } ${
              header.hideAtWith &&
              header.hideAtWith === TableHideLevelEnum.Medium
                ? styles.hideAt900px
                : header.hideAtWith &&
                  header.hideAtWith === TableHideLevelEnum.Small
                ? styles.hideAt800px
                : header.hideAtWith &&
                  header.hideAtWith === TableHideLevelEnum.VerySmall
                ? styles.hideAt700px
                : ""
            }`}
          >
            {row[header.td]}
          </td>
        ))}
        {actions && actions.length > 0 && (
          <td>
            <div className={styles.contentTdActions}>
              {actions.includes(TableActionEnum.CompleteTask) &&
                row[DEFAULT_NAME_FOR_COMPLETE_TASK] ===
                  TaskStatusEnum.Pending && (
                  <PendingIcon
                    onClick={() =>
                      handleOnAlterTaskStatus
                        ? handleOnAlterTaskStatus(
                            row.id,
                            TaskStatusEnum.Pending
                          )
                        : undefined
                    }
                    width={25}
                  />
                )}
              {actions.includes(TableActionEnum.CompleteTask) &&
                row[DEFAULT_NAME_FOR_COMPLETE_TASK] ===
                  TaskStatusEnum.Completed && (
                  <CompletedIcon
                    onClick={() =>
                      handleOnAlterTaskStatus
                        ? handleOnAlterTaskStatus(
                            row.id,
                            TaskStatusEnum.Completed
                          )
                        : undefined
                    }
                    width={25}
                  />
                )}
              {actions.includes(TableActionEnum.CompleteTask) &&
                row[DEFAULT_NAME_FOR_COMPLETE_TASK] ===
                  TaskStatusEnum.Overdue && (
                  <OverdueIcon
                    onClick={() =>
                      handleOnAlterTaskStatus
                        ? handleOnAlterTaskStatus(
                            row.id,
                            TaskStatusEnum.Overdue
                          )
                        : undefined
                    }
                    width={25}
                  />
                )}

              {actions.includes(TableActionEnum.Update) && (
                <PencilIcon onClick={() => handleOnUpdate(row.id)} width={25} />
              )}
              {actions.includes(TableActionEnum.Delete) && (
                <TrashIcon
                  onClick={() => handleOnOpenModalDelete(row.id)}
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
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(
      totalPages,
      startPage + PAGINATION.DEFAULT_LIMIT - 1
    );

    if (endPage - startPage + 1 < PAGINATION.DEFAULT_LIMIT) {
      startPage = Math.max(1, endPage - PAGINATION.DEFAULT_LIMIT + 1);
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
              <th
                key={index}
                className={`${
                  header.hideAtWith &&
                  header.hideAtWith === TableHideLevelEnum.Medium
                    ? styles.hideAt900px
                    : header.hideAtWith &&
                      header.hideAtWith === TableHideLevelEnum.Small
                    ? styles.hideAt800px
                    : header.hideAtWith &&
                      header.hideAtWith === TableHideLevelEnum.VerySmall
                    ? styles.hideAt700px
                    : ""
                }`}
              >
                {header.th}
              </th>
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
