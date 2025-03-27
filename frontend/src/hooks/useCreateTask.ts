import { useNavigate } from "react-router-dom";
import { useGlobalReducer } from "../store/reducers/globalReducer/useGlobalReducer";
import { useRequest } from "../utils/functions/request";
import { useEffect, useState } from "react";
import { TaskDto } from "../dtos/taskDto";
import { DEFAULT_TASK } from "../utils/dtos";
import {
  ERROR_MESSAGES,
  FIELD_VALIDATION_MESSAGES,
  SUCCESS_MESSAGES,
} from "../utils/messages";
import { TaskType } from "../types/TaskType";
import { MethodEnum } from "../enums/MethodEnum";
import { URL_TASK, URL_TASK_ID } from "../config/urls";
import { NotificationEnum } from "../enums/NotificationEnum";
import { TaskRoutesEnum } from "../routes/taskRoutes";
import { useTask } from "./useTask";
import { AxiosError } from "axios";
import { DATETIME_FORMAT, TASK } from "../config/constants";
import { useTaskReducer } from "../store/reducers/taskReducer/useTaskReducer";
import { FieldValidationType } from "../types/FieldValidationType";
import { useCategory } from "./useCategory";
import { format } from "date-fns";

export const useCreateTask = (taskId?: string) => {
  const { setNotification } = useGlobalReducer();

  const { task: taskReducer, setTask: setTaskReducer } = useTaskReducer();

  const { fetchTasks } = useTask();
  const { categories } = useCategory();

  const { request, loadingRequest } = useRequest();
  const navigate = useNavigate();

  const [loadingTask, setLoadingTask] = useState<boolean>(true);
  const [disabledButton, setDisabledButton] = useState<boolean>(true);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [task, setTask] = useState<TaskDto>(DEFAULT_TASK);

  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [warningFields, setWarningFields] = useState<string[]>([]);

  useEffect(() => {
    if (taskId) {
      const findAndSetTaskReducer = async (taskId: string) => {
        await request<TaskType>({
          method: MethodEnum.Get,
          url: URL_TASK_ID.replace(":taskId", taskId),
          timeout: 1000,
        })
          .then(async (data) => {
            setTaskReducer(data);
            setLoadingTask(false);
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

      setIsEdit(true);
      findAndSetTaskReducer(taskId);
    } else {
      setIsEdit(false);
      setTaskReducer(undefined);
      setLoadingTask(false);
    }
  }, [taskId]);

  useEffect(() => {
    if (taskReducer) {
      setTask({
        title: taskReducer.title,
        description: taskReducer.description,
        priority: taskReducer.priority,
        limitDate: String(format(taskReducer.limitDate, DATETIME_FORMAT.INPUT)),
        categoryId: taskReducer.category?.id,
      });

      const fieldsToValidate: FieldValidationType[] = [
        { id: "title", value: taskReducer.title },
        {
          id: "limitDate",
          value: String(format(taskReducer.limitDate, DATETIME_FORMAT.INPUT)),
        },
      ];

      fieldsToValidate.forEach((item) => {
        handleValidateOnEdit(item);
      });
    } else {
      setTask(DEFAULT_TASK);
      setInvalidFields([]);
      setWarningFields([]);
    }
  }, [taskReducer]);

  useEffect(() => {
    if (
      task.title.length >= TASK.TITLE_LENGTH.MIN &&
      task.title.length <= TASK.TITLE_LENGTH.MAX &&
      task.priority &&
      task.limitDate
    ) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  }, [task]);

  const validateInputField = (
    name: string,
    value: string,
    input: HTMLInputElement
  ) => {
    if (!["title", "limitDate"].includes(name)) {
      return;
    }

    const isValid = () => {
      input.setCustomValidity("");
      setInvalidFields((prev) => prev.filter((item) => item !== name));
      setWarningFields((prev) => prev.filter((item) => item !== name));
    };

    if (!value) {
      input.setCustomValidity(FIELD_VALIDATION_MESSAGES.REQUIRED);
      setInvalidFields((prev) => [...prev, name]);
    } else if (name === "title") {
      if (value.length < TASK.TITLE_LENGTH.MIN) {
        input.setCustomValidity(
          FIELD_VALIDATION_MESSAGES.TASK.TITLE.MIN_CHARACTER(
            TASK.TITLE_LENGTH.MIN
          )
        );
        setInvalidFields((prev) => [...prev, name]);
      } else if (value.length > TASK.TITLE_LENGTH.MAX) {
        input.setCustomValidity(
          FIELD_VALIDATION_MESSAGES.TASK.TITLE.MAX_CHARACTER(
            TASK.TITLE_LENGTH.MAX
          )
        );
        setInvalidFields((prev) => [...prev, name]);
      } else {
        isValid();
      }
    } else if (name === "limitDate") {
      if (new Date(value) < new Date()) {
        input.setCustomValidity(
          FIELD_VALIDATION_MESSAGES.TASK.LIMIT_DATE.PAST_DATE
        );
        setWarningFields((prev) => [...prev, name]);
      } else {
        isValid();
      }
    } else {
      isValid();
    }

    input.reportValidity();
  };

  const handleValidateOnEdit = ({ id, value }: FieldValidationType) => {
    const input = document.getElementById(id) as HTMLInputElement;

    if (!input) return;

    validateInputField(id, value, input);
  };

  const handleOnChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const input = e.target;
    const value = input.value;

    setTask({
      ...task,
      [name]: value,
    });

    validateInputField(name, value, input);
  };

  const handleOnChangeTextArea = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    name: string
  ) => {
    const textarea = e.target;
    const value = textarea.value;

    setTask({
      ...task,
      [name]: value,
    });
  };

  const handleOnChangeCategorySelect = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const select = e.target;
    const value = select.value ? Number(select.value) : undefined;

    setTask({
      ...task,
      categoryId: value,
    });
  };

  const handleOnChangePrioritySelect = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const select = e.target;
    const value = Number(select.value);

    setTask({
      ...task,
      priority: value,
    });
  };

  const handleOnPreSubmit = () => {
    const limitDateInput = document.getElementById(
      "limitDate"
    ) as HTMLInputElement;

    if (limitDateInput) {
      limitDateInput.setCustomValidity("");
      limitDateInput.reportValidity();
    }
  };

  const handleOnCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    task.limitDate = task.limitDate.replace("T", " ");

    if (taskId) {
      await request<TaskType>({
        method: MethodEnum.Put,
        url: URL_TASK_ID.replace(":taskId", taskId),
        body: task,
        timeout: 1000,
      })
        .then(async () => {
          await fetchTasks(0);

          setNotification({
            message: SUCCESS_MESSAGES.TASK.TASK_UPDATE_SUCCESSFULLY,
            type: NotificationEnum.Success,
          });

          navigate(TaskRoutesEnum.Tasks);
        })
        .catch((error: AxiosError) => {
          const responseErrorMessage =
            (error.response?.data as string) || ERROR_MESSAGES.DEFAULT;

          setNotification({
            message: responseErrorMessage,
            type: NotificationEnum.Error,
          });
        });
    } else {
      await request<TaskType>({
        method: MethodEnum.Post,
        url: URL_TASK,
        body: task,
        timeout: 1000,
      })
        .then(async () => {
          await fetchTasks(0);

          setNotification({
            message: SUCCESS_MESSAGES.TASK.TASK_CREATED_SUCCESSFULLY,
            type: NotificationEnum.Success,
          });

          navigate(TaskRoutesEnum.Tasks);
        })
        .catch((error: AxiosError) => {
          const responseErrorMessage =
            (error.response?.data as string) || ERROR_MESSAGES.DEFAULT;

          setNotification({
            message: responseErrorMessage,
            type: NotificationEnum.Error,
          });
        });
    }
  };

  const handleOnReset = () => {
    setTask(DEFAULT_TASK);
    setInvalidFields([]);
    setWarningFields([]);
  };

  const handleOnCancel = () => {
    navigate(TaskRoutesEnum.Tasks);
  };

  return {
    task,
    loadingTask,
    loadingRequest,
    disabledButton,
    isEdit,
    invalidFields,
    warningFields,
    categories,
    handleOnChangeInput,
    handleOnChangeTextArea,
    handleOnChangeCategorySelect,
    handleOnChangePrioritySelect,
    handleOnPreSubmit,
    handleOnCreate,
    handleOnReset,
    handleOnCancel,
  };
};
