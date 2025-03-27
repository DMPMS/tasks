import { useNavigate } from "react-router-dom";
import { useGlobalReducer } from "../store/reducers/globalReducer/useGlobalReducer";
import { useRequest } from "../utils/functions/request";
import { useEffect, useState } from "react";
import { SignInDto } from "../dtos/signInDto";
import { DEFAULT_SIGN_IN } from "../utils/dtos";
import { isValidEmail } from "../utils/functions/valitadion";
import { AuthType } from "../types/AuthType";
import { MethodEnum } from "../enums/MethodEnum";
import { URL_AUTH } from "../config/urls";
import { SignUpRoutesEnum } from "../routes/signUpRoutes";
import { setAuthorizationToken } from "../utils/functions/auth";
import { AuthRedirectRoutesEnum } from "../routes/authRedirectRoutes";
import { AxiosError } from "axios";
import { NotificationEnum } from "../enums/NotificationEnum";
import { ERROR_MESSAGES, FIELD_VALIDATION_MESSAGES } from "../utils/messages";
import { useTaskReducer } from "../store/reducers/taskReducer/useTaskReducer";
import { useCategoryReducer } from "../store/reducers/categoryReducer/useCategoryReducer";
import { useUserReducer } from "../store/reducers/userReducer/useUserReducer";

export const useSignIn = () => {
  const { setUser, setNotification } = useGlobalReducer();
  const { setTask, setTasks } = useTaskReducer();
  const { setCategory, setCategories } = useCategoryReducer();
  const { setUsers } = useUserReducer();

  const { request, loadingRequest } = useRequest();
  const navigate = useNavigate();

  const [disabledButton, setDisabledButton] = useState<boolean>(true);
  const [signIn, setSignIn] = useState<SignInDto>(DEFAULT_SIGN_IN);

  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [warningFields, setWarningFields] = useState<string[]>([]);

  useEffect(() => {
    if (signIn.email && signIn.password && isValidEmail(signIn.email)) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  }, [signIn]);

  const validateInputField = (
    name: string,
    value: string,
    input: HTMLInputElement
  ) => {
    if (!["email", "password"].includes(name)) {
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
    } else if (name === "email") {
      if (!isValidEmail(value)) {
        input.setCustomValidity(
          FIELD_VALIDATION_MESSAGES.SIGN_IN.EMAIL_INVALID
        );
        setInvalidFields((prev) => [...prev, name]);
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

    setSignIn({
      ...signIn,
      [name]: name === "email" ? value.toLowerCase() : value,
    });

    validateInputField(name, value, input);
  };

  const handleOnSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    await request<AuthType>({
      method: MethodEnum.Post,
      url: URL_AUTH,
      body: signIn,
      timeout: 1000,
    })
      .then((data) => {
        setUser(data.user);
        setAuthorizationToken(data.token);

        setCategory(undefined);
        setCategories([]);
        setTask(undefined);
        setTasks([]);
        setUsers([]);

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
  };

  const handleOnSignUp = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(SignUpRoutesEnum.SignUp);
  };

  return {
    loadingRequest,
    disabledButton,
    invalidFields,
    warningFields,
    handleOnChangeInput,
    handleOnSignIn,
    handleOnSignUp,
  };
};
