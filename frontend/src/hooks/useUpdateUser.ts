import { useNavigate } from "react-router-dom";
import { useGlobalReducer } from "../store/reducers/globalReducer/useGlobalReducer";
import { useRequest } from "../utils/functions/request";
import { useEffect, useState } from "react";
import { UserDto } from "../dtos/userDto";
import { DEFAULT_USER } from "../utils/dtos";
import { FieldValidationType } from "../types/FieldValidationType";
import { USER } from "../config/constants";
import { isValidEmail } from "../utils/functions/valitadion";
import { UserType } from "../types/UserType";
import { MethodEnum } from "../enums/MethodEnum";
import { URL_USER, URL_USER_INFO, URL_USER_UPDATE } from "../config/urls";
import {
  ERROR_MESSAGES,
  FIELD_VALIDATION_MESSAGES,
  SUCCESS_MESSAGES,
} from "../utils/messages";
import { NotificationEnum } from "../enums/NotificationEnum";
import { UserRoutesEnum } from "../routes/userRoutes";
import { AxiosError } from "axios";
import { logout } from "../utils/functions/auth";

export const useUpdateUser = () => {
  const {
    user: userReducer,
    setUser: setUserReducer,
    setNotification,
  } = useGlobalReducer();

  const { request, loadingRequest } = useRequest();
  const navigate = useNavigate();

  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [disabledButton, setDisabledButton] = useState<boolean>(true);
  const [user, setUser] = useState<UserDto>(DEFAULT_USER);

  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [deletePassword, setDeletePassword] = useState<string>("");

  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [warningFields, setWarningFields] = useState<string[]>([]);

  // Just to retrigger handleValidateOnEdit after the component has been mounted.
  const [aux, setAux] = useState<boolean>(false);

  useEffect(() => {
    if (!userReducer) {
      const findAndSetUserReducer = async () => {
        await request<UserType>({
          method: MethodEnum.Get,
          url: URL_USER_INFO,
          timeout: 1000,
        })
          .then(async (data) => {
            setUserReducer(data);
            setLoadingUser(false);
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

      findAndSetUserReducer();
    } else {
      setLoadingUser(false);
    }

    setAux(true);
  }, []);

  useEffect(() => {
    setUser({
      name: userReducer?.name || DEFAULT_USER.name,
      email: userReducer?.email || DEFAULT_USER.email,
      newPassword: DEFAULT_USER.newPassword,
      confirmNewPassword: DEFAULT_USER.confirmNewPassword,
      password: DEFAULT_USER.password,
    });

    const fieldsToValidate: FieldValidationType[] = [
      { id: "name", value: userReducer?.name || DEFAULT_USER.name },
      {
        id: "email",
        value: userReducer?.email || DEFAULT_USER.email,
      },
      {
        id: "password",
        value: DEFAULT_USER.password,
      },
    ];

    fieldsToValidate.forEach((item) => {
      handleValidateOnEdit(item);
    });
  }, [userReducer, aux]);

  useEffect(() => {
    if (
      user.name.length >= USER.NAME_LENGTH.MIN &&
      user.name.length <= USER.NAME_LENGTH.MAX &&
      user.email.length >= USER.EMAIL_LENGTH.MIN &&
      user.email.length <= USER.EMAIL_LENGTH.MAX &&
      isValidEmail(user.email) &&
      user.password
    ) {
      if (user.newPassword) {
        if (
          user.newPassword.length >= USER.PASSWORD_LENGTH.MIN &&
          user.newPassword.length <= USER.PASSWORD_LENGTH.MAX &&
          user.confirmNewPassword.length >= USER.CONFIRM_PASSWORD_LENGTH.MIN &&
          user.confirmNewPassword.length <= USER.CONFIRM_PASSWORD_LENGTH.MAX &&
          user.newPassword === user.confirmNewPassword
        ) {
          setDisabledButton(false);
        } else {
          setDisabledButton(true);
        }
      } else {
        setDisabledButton(false);
      }
    } else {
      setDisabledButton(true);
    }
  }, [user]);

  useEffect(() => {
    if (openModalDelete) {
      setDeletePassword("");

      handleValidateOnEdit({
        id: "deletePassword",
        value: "",
      });
    }
  }, [openModalDelete]);

  const validateInputField = (
    name: string,
    value: string,
    input: HTMLInputElement
  ) => {
    if (
      ![
        "name",
        "email",
        "newPassword",
        "confirmNewPassword",
        "password",
        "deletePassword",
      ].includes(name)
    ) {
      return;
    }

    const isValid = () => {
      input.setCustomValidity("");
      setInvalidFields((prev) => prev.filter((item) => item !== name));
      setWarningFields((prev) => prev.filter((item) => item !== name));
    };

    if (!value) {
      if (name === "newPassword") {
        const inputConfirmNewPassword = document.getElementById(
          "confirmNewPassword"
        ) as HTMLInputElement;

        inputConfirmNewPassword.setCustomValidity("");
        setInvalidFields((prev) =>
          prev.filter((item) => item !== "confirmNewPassword")
        );
        setWarningFields((prev) =>
          prev.filter((item) => item !== "confirmNewPassword")
        );

        isValid();
      } else {
        input.setCustomValidity(FIELD_VALIDATION_MESSAGES.REQUIRED);
        setInvalidFields((prev) => [...prev, name]);
      }
    } else if (name === "name") {
      if (value.length < USER.NAME_LENGTH.MIN) {
        input.setCustomValidity(
          FIELD_VALIDATION_MESSAGES.USER.NAME.MIN_CHARACTER(
            USER.NAME_LENGTH.MIN
          )
        );
        setInvalidFields((prev) => [...prev, name]);
      } else if (value.length > USER.NAME_LENGTH.MAX) {
        input.setCustomValidity(
          FIELD_VALIDATION_MESSAGES.USER.NAME.MAX_CHARACTER(
            USER.NAME_LENGTH.MAX
          )
        );
        setInvalidFields((prev) => [...prev, name]);
      } else {
        isValid();
      }
    } else if (name === "email") {
      if (value.length < USER.EMAIL_LENGTH.MIN) {
        input.setCustomValidity(
          FIELD_VALIDATION_MESSAGES.USER.EMAIL.MIN_CHARACTER(
            USER.EMAIL_LENGTH.MIN
          )
        );
        setInvalidFields((prev) => [...prev, name]);
      } else if (value.length > USER.EMAIL_LENGTH.MAX) {
        input.setCustomValidity(
          FIELD_VALIDATION_MESSAGES.USER.EMAIL.MAX_CHARACTER(
            USER.EMAIL_LENGTH.MAX
          )
        );
        setInvalidFields((prev) => [...prev, name]);
      } else if (!isValidEmail(value)) {
        input.setCustomValidity(
          FIELD_VALIDATION_MESSAGES.USER.EMAIL.EMAIL_INVALID
        );
        setInvalidFields((prev) => [...prev, name]);
      } else {
        isValid();
      }
    } else if (name === "newPassword") {
      if (value.length < USER.PASSWORD_LENGTH.MIN) {
        input.setCustomValidity(
          FIELD_VALIDATION_MESSAGES.USER.PASSWORD.MIN_CHARACTER(
            USER.PASSWORD_LENGTH.MIN
          )
        );
        setInvalidFields((prev) => [...prev, name]);
      } else if (value.length > USER.PASSWORD_LENGTH.MAX) {
        input.setCustomValidity(
          FIELD_VALIDATION_MESSAGES.USER.PASSWORD.MAX_CHARACTER(
            USER.PASSWORD_LENGTH.MAX
          )
        );
        setInvalidFields((prev) => [...prev, name]);
      } else {
        isValid();
      }

      const inputConfirmNewPassword = document.getElementById(
        "confirmNewPassword"
      ) as HTMLInputElement;

      if (value !== inputConfirmNewPassword.value) {
        inputConfirmNewPassword.setCustomValidity(
          FIELD_VALIDATION_MESSAGES.USER.CONFIRM_PASSWORD.PASSWORDS_DO_NOT_MATCH
        );
        setInvalidFields((prev) => [...prev, "confirmNewPassword"]);
      } else {
        inputConfirmNewPassword.setCustomValidity("");
        setInvalidFields((prev) =>
          prev.filter((item) => item !== "confirmNewPassword")
        );
        setWarningFields((prev) =>
          prev.filter((item) => item !== "confirmNewPassword")
        );
      }
    } else if (name === "confirmNewPassword") {
      if (value.length < USER.CONFIRM_PASSWORD_LENGTH.MIN) {
        input.setCustomValidity(
          FIELD_VALIDATION_MESSAGES.USER.CONFIRM_PASSWORD.MIN_CHARACTER(
            USER.CONFIRM_PASSWORD_LENGTH.MIN
          )
        );
        setInvalidFields((prev) => [...prev, name]);
      } else if (value.length > USER.CONFIRM_PASSWORD_LENGTH.MAX) {
        input.setCustomValidity(
          FIELD_VALIDATION_MESSAGES.USER.CONFIRM_PASSWORD.MAX_CHARACTER(
            USER.CONFIRM_PASSWORD_LENGTH.MAX
          )
        );
        setInvalidFields((prev) => [...prev, name]);
      } else {
        const inputNewPassword = document.getElementById(
          "newPassword"
        ) as HTMLInputElement;

        if (value !== inputNewPassword.value) {
          input.setCustomValidity(
            FIELD_VALIDATION_MESSAGES.USER.CONFIRM_PASSWORD
              .PASSWORDS_DO_NOT_MATCH
          );
          setInvalidFields((prev) => [...prev, name]);
        } else {
          isValid();
        }
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

    if (name === "deletePassword") {
      setDeletePassword(value);
    } else {
      setUser({
        ...user,
        [name]: name === "email" ? value.toLowerCase() : value,
        ...(name === "newPassword" &&
          value === "" && { confirmNewPassword: "" }),
      });
    }

    validateInputField(name, value, input);
  };

  const handleOnUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      newPassword: user.newPassword ? user.newPassword : null,
      confirmNewPassword: user.confirmNewPassword
        ? user.confirmNewPassword
        : null,
    };

    await request<UserType>({
      method: MethodEnum.Put,
      url: URL_USER_UPDATE,
      body: updatedUser,
      timeout: 1000,
    })
      .then(async () => {
        if (userReducer) {
          setUserReducer({
            ...userReducer,
            name: user.name,
            email: user.email,
          });
        }

        setNotification({
          message: SUCCESS_MESSAGES.USER.USER_UPDATED_SUCCESSFULLY,
          type: NotificationEnum.Success,
        });

        navigate(UserRoutesEnum.UpdateUser);
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

  const handleOnDelete = async () => {
    await request<void>({
      method: MethodEnum.Delete,
      url: URL_USER,
      timeout: 1000,
      body: {
        password: deletePassword,
      },
    })
      .then(async () => {
        setNotification({
          message: SUCCESS_MESSAGES.USER.USER_MY_DELETED_SUCCESSFULLY,
          type: NotificationEnum.Success,
        });

        logout(navigate);
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
    setUser(DEFAULT_USER);
    setInvalidFields([]);
    setWarningFields([]);
  };

  const handleOnCloseModalDelete = () => {
    setOpenModalDelete(false);
  };

  const handleOnOpenModalDelete = () => {
    setOpenModalDelete(true);
  };

  return {
    user,
    loadingUser,
    loadingRequest,
    disabledButton,
    invalidFields,
    warningFields,
    handleOnChangeInput,
    handleOnUpdate,
    handleOnReset,
    handleOnDelete,
    openModalDelete,
    handleOnOpenModalDelete,
    handleOnCloseModalDelete,
  };
};
