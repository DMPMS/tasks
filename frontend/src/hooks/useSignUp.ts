import { useEffect, useState } from "react";
import { useGlobalReducer } from "../store/reducers/globalReducer/useGlobalReducer";
import { useRequest } from "../utils/functions/request";
import { SignUpDto } from "../dtos/signUpDto";
import { DEFAULT_SIGN_UP } from "../utils/dtos";
import { isValidEmail } from "../utils/functions/valitadion";
import { UserType } from "../types/UserType";
import { MethodEnum } from "../enums/MethodEnum";
import { URL_AUTH, URL_USER } from "../config/urls";
import { AxiosError } from "axios";
import { ERROR_MESSAGES, FIELD_VALIDATION_MESSAGES } from "../utils/messages";
import { NotificationEnum } from "../enums/NotificationEnum";
import { SignInRoutesEnum } from "../routes/signInRoutes";
import { useNavigate } from "react-router-dom";
import { USER } from "../config/constants";
import { AuthType } from "../types/AuthType";
import { setAuthorizationToken } from "../utils/functions/auth";
import { AuthRedirectRoutesEnum } from "../routes/authRedirectRoutes";
import { useTaskReducer } from "../store/reducers/taskReducer/useTaskReducer";
import { useCategoryReducer } from "../store/reducers/categoryReducer/useCategoryReducer";
import { jwtDecode } from "jwt-decode";
import { TokenType } from "../types/TokenType";

export const useSignUp = () => {
  const { setUser, setNotification } = useGlobalReducer();
  const { setTask, setTasks } = useTaskReducer();
  const { setCategory, setCategories } = useCategoryReducer();

  const { request, loadingRequest } = useRequest();
  const navigate = useNavigate();

  const [disabledButton, setDisabledButton] = useState<boolean>(true);
  const [signUp, setSignUp] = useState<SignUpDto>(DEFAULT_SIGN_UP);

  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [warningFields, setWarningFields] = useState<string[]>([]);

  useEffect(() => {
    if (
      signUp.name.length >= USER.NAME_LENGTH.MIN &&
      signUp.name.length <= USER.NAME_LENGTH.MAX &&
      signUp.email.length >= USER.EMAIL_LENGTH.MIN &&
      signUp.email.length <= USER.EMAIL_LENGTH.MAX &&
      isValidEmail(signUp.email) &&
      signUp.password.length >= USER.PASSWORD_LENGTH.MIN &&
      signUp.password.length <= USER.PASSWORD_LENGTH.MAX &&
      signUp.confirmPassword.length >= USER.CONFIRM_PASSWORD_LENGTH.MIN &&
      signUp.confirmPassword.length <= USER.CONFIRM_PASSWORD_LENGTH.MAX &&
      signUp.password === signUp.confirmPassword
    ) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  }, [signUp]);

  const validateInputField = (
    name: string,
    value: string,
    input: HTMLInputElement
  ) => {
    if (!["name", "email", "password", "confirmPassword"].includes(name)) {
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

      if (name === "password") {
        const inputConfirmPassword = document.getElementById(
          "confirmPassword"
        ) as HTMLInputElement;

        if (value !== inputConfirmPassword.value) {
          inputConfirmPassword.setCustomValidity(
            FIELD_VALIDATION_MESSAGES.USER.CONFIRM_PASSWORD
              .PASSWORDS_DO_NOT_MATCH
          );
          setInvalidFields((prev) => [...prev, "confirmPassword"]);
        } else {
          inputConfirmPassword.setCustomValidity("");
          setInvalidFields((prev) =>
            prev.filter((item) => item !== "confirmPassword")
          );
          setWarningFields((prev) =>
            prev.filter((item) => item !== "confirmPassword")
          );
        }
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
    } else if (name === "password") {
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

      const inputConfirmPassword = document.getElementById(
        "confirmPassword"
      ) as HTMLInputElement;

      if (value !== inputConfirmPassword.value) {
        inputConfirmPassword.setCustomValidity(
          FIELD_VALIDATION_MESSAGES.USER.CONFIRM_PASSWORD.PASSWORDS_DO_NOT_MATCH
        );
        setInvalidFields((prev) => [...prev, "confirmPassword"]);
      } else {
        inputConfirmPassword.setCustomValidity("");
        setInvalidFields((prev) =>
          prev.filter((item) => item !== "confirmPassword")
        );
        setWarningFields((prev) =>
          prev.filter((item) => item !== "confirmPassword")
        );
      }
    } else if (name === "confirmPassword") {
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
        const inputPassword = document.getElementById(
          "password"
        ) as HTMLInputElement;

        if (value !== inputPassword.value) {
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

  const handleOnChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const input = e.target;
    const value = input.value;

    setSignUp({
      ...signUp,
      [name]: name === "email" ? value.toLowerCase() : value,
    });

    validateInputField(name, value, input);
  };

  const handleOnSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    await request<UserType>({
      method: MethodEnum.Post,
      url: URL_USER,
      body: signUp,
      timeout: 1000,
    })
      .then(async () => {
        await request<AuthType>({
          method: MethodEnum.Post,
          url: URL_AUTH,
          body: {
            email: signUp.email,
            password: signUp.password,
          },
          timeout: 0,
        })
          .then((data) => {
            setAuthorizationToken(data.token);

            const decodedToken = jwtDecode<TokenType>(data.token.split(" ")[1]);

            setUser({
              id: decodedToken.userId,
              name: decodedToken.userName,
              email: decodedToken.userEmail,
            });

            setCategory(undefined);
            setCategories([]);
            setTask(undefined);
            setTasks([]);

            navigate(AuthRedirectRoutesEnum.AuthRedirect);
          })
          .catch((error: AxiosError) => {
            const responseErrorMessage =
              (error.response?.data as string) || ERROR_MESSAGES.DEFAULT;

            setNotification({
              message: responseErrorMessage,
              type: NotificationEnum.Error,
            });
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
  };

  const handleOnReset = () => {
    setSignUp(DEFAULT_SIGN_UP);
    setInvalidFields([]);
    setWarningFields([]);
  };

  const handleOnSignIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(SignInRoutesEnum.SignIn);
  };

  return {
    signUp,
    loadingRequest,
    disabledButton,
    invalidFields,
    warningFields,
    handleOnChangeInput,
    handleOnSignUp,
    handleOnSignIn,
    handleOnReset,
  };
};
