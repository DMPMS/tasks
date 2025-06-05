import { useNavigate } from "react-router-dom";
import { useTaskReducer } from "../store/reducers/taskReducer/useTaskReducer";
import { useRequest } from "../utils/functions/request";
import { useEffect, useState } from "react";
import { MethodEnum } from "../enums/MethodEnum";
import { URL_TASK, URL_TASK_ID, URL_TASK_ID_STATUS } from "../config/urls";
import { TaskType } from "../types/TaskType";
import { TaskRoutesEnum } from "../routes/taskRoutes";
import { AxiosError } from "axios";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utils/messages";
import { NotificationEnum } from "../enums/NotificationEnum";
import { useGlobalReducer } from "../store/reducers/globalReducer/useGlobalReducer";
import { TaskStatusEnum } from "../enums/TaskStatusEnum";
import { format } from "date-fns";
import { DATETIME_FORMAT } from "../config/constants";
import { logout } from "../utils/functions/auth";

export const useTask = () => {
  const { setNotification } = useGlobalReducer();
  const { tasks, setTasks } = useTaskReducer();

  const { request, loadingRequest } = useRequest();
  const navigate = useNavigate();

  const [loadingTasks, setLoadingTasks] = useState<boolean>(true);
  const [taskIdDelete, setTaskIdDelete] = useState<number | undefined>(
    undefined
  );
  const [searchValue, setSearchValue] = useState<string>("");

  const tasksFiltered = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const fetchTasks = async (timetout: number) => {
    await request<TaskType[]>({
      method: MethodEnum.Get,
      url: URL_TASK,
      timeout: timetout,
    })
      .then((data) => {
        setTasks(data);
        setLoadingTasks(false);
      })
      .catch((error: AxiosError) => {
        const responseErrorMessage =
          (error.response?.data as string) || ERROR_MESSAGES.DEFAULT;

        setNotification({
          message: responseErrorMessage,
          type: NotificationEnum.Error,
        });

        logout(navigate);
      });
  };

  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      fetchTasks(1000);
    } else {
      setLoadingTasks(false);
    }
  }, []);

  const handleOnCreate = () => {
    navigate(TaskRoutesEnum.CreateTask);
  };

  const handleOnUpdate = (taskId: number) => {
    navigate(TaskRoutesEnum.UpdateTask.replace(":taskId", `${taskId}`));
  };

  const handleOnSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleOnDelete = async () => {
    await request<void>({
      method: MethodEnum.Delete,
      url: URL_TASK_ID.replace(":taskId", `${taskIdDelete}`),
      timeout: 1000,
    })
      .then(async () => {
        await fetchTasks(0);

        setNotification({
          message: SUCCESS_MESSAGES.TASK.TASK_DELETED_SUCCESSFULLY,
          type: NotificationEnum.Success,
        });
      })
      .catch((error: AxiosError) => {
        const responseErrorMessage =
          (error.response?.data as string) || ERROR_MESSAGES.DEFAULT;

        setNotification({
          message: responseErrorMessage,
          type: NotificationEnum.Error,
        });
      });

    setTaskIdDelete(undefined);
  };

  const handleOnAlterTaskStatus = async (
    taskId: number,
    status: TaskStatusEnum
  ) => {
    const completedDate =
      status === TaskStatusEnum.Completed
        ? { completedDate: undefined }
        : { completedDate: format(new Date(), DATETIME_FORMAT.REQUEST) };

    await request<TaskType>({
      method: MethodEnum.Patch,
      url: URL_TASK_ID_STATUS.replace(":taskId", `${taskId}`),
      body: completedDate,
    })
      .then(async () => {
        await fetchTasks(0);
      })
      .catch((error: AxiosError) => {
        const responseErrorMessage =
          (error.response?.data as string) || ERROR_MESSAGES.DEFAULT;

        setNotification({
          message: responseErrorMessage,
          type: NotificationEnum.Error,
        });
      });
  };

  const handleOnCloseModalDelete = () => {
    setTaskIdDelete(undefined);
  };

  const handleOnOpenModalDelete = (taskId: number) => {
    setTaskIdDelete(taskId);
  };

  return {
    loadingTasks,
    loadingRequest,
    tasks: tasksFiltered,
    handleOnCreate,
    handleOnUpdate,
    handleOnSearch,
    handleOnAlterTaskStatus,
    handleOnDelete,
    openModalDelete: !!taskIdDelete,
    handleOnOpenModalDelete,
    handleOnCloseModalDelete,
    fetchTasks,
  };
};
