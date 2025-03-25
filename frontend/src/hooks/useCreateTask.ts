import { useNavigate } from "react-router-dom";
import { useGlobalReducer } from "../store/reducers/globalReducer/useGlobalReducer";
import { useRequest } from "../utils/functions/request";
import { useEffect, useState } from "react";
import { CreateTaskDto } from "../dtos/createTaskDto";
import { DEFAULT_CREATE_TASK } from "../utils/dtos";
import {
  ERROR_MESSAGES,
  FIELD_VALIDATION_MESSAGES,
  SUCCESS_MESSAGES,
} from "../utils/messages";
import { TaskType } from "../types/TaskType";
import { MethodEnum } from "../enums/MethodEnum";
import { URL_TASK } from "../config/urls";
import { NotificationEnum } from "../enums/NotificationEnum";
import { TaskRoutesEnum } from "../routes/taskRoutes";
import { useTask } from "./useTask";
import { AxiosError } from "axios";
import { TASK } from "../config/constants";

export const useCreateTask = () => {
  const { setNotification } = useGlobalReducer();

  const { fetchTasks } = useTask();

  const { request, loadingRequest } = useRequest();
  const navigate = useNavigate();

  const [disabledButton, setDisabledButton] = useState<boolean>(true);
  const [task, setTask] = useState<CreateTaskDto>(DEFAULT_CREATE_TASK);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [warningFields, setWarningFields] = useState<string[]>([]);

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

    if (["title", "limitDate"].includes(name)) {
      validateInputField(name, value, input);
    }
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

    await request<TaskType>({
      method: MethodEnum.Post,
      url: URL_TASK,
      body: task,
      timeout: 2000,
    })
      .then(() => {
        setNotification({
          message: SUCCESS_MESSAGES.TASK.TASK_CREATED_SUCCESSFULLY,
          type: NotificationEnum.Success,
        });

        fetchTasks();

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
  };

  const handleOnReset = () => {
    setTask(DEFAULT_CREATE_TASK);
  };

  const handleOnCancel = () => {
    navigate(TaskRoutesEnum.Tasks);
  };

  return {
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
    handleOnReset,
    handleOnCancel,
  };
};
