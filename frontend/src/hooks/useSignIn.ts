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

export const useSignIn = () => {
  const { setNotification } = useGlobalReducer();
  const { setUser } = useGlobalReducer();

  const { request, loadingRequest } = useRequest();
  const navigate = useNavigate();

  const [disabledButton, setDisabledButton] = useState<boolean>(true);
  const [signIn, setSignIn] = useState<SignInDto>(DEFAULT_SIGN_IN);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);

  useEffect(() => {
    if (signIn.email && signIn.password && isValidEmail(signIn.email)) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  }, [signIn]);

  const validateField = (
    name: string,
    value: string,
    input: HTMLInputElement
  ) => {
    if (!value) {
      input.setCustomValidity(FIELD_VALIDATION_MESSAGES.REQUIRED);
      setInvalidFields((prev) => [...prev, name]);
    } else if (name === "email" && !isValidEmail(value)) {
      input.setCustomValidity(FIELD_VALIDATION_MESSAGES.SIGN_IN.EMAIL_INVALID);
      setInvalidFields((prev) => [...prev, name]);
    } else {
      input.setCustomValidity("");
      setInvalidFields((prev) => prev.filter((item) => item !== name));
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

    validateField(name, value, input);
  };

  const handleOnSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    await request<AuthType>({
      method: MethodEnum.Post,
      url: URL_AUTH,
      body: signIn,
      timeout: 2000,
    })
      .then((data) => {
        setUser(data.user);
        setAuthorizationToken(data.token);
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

  const handleOnSignUp = () => {
    navigate(SignUpRoutesEnum.SignUp);
  };

  return {
    loadingRequest,
    disabledButton,
    invalidFields,
    handleOnChangeInput,
    handleOnSignIn,
    handleOnSignUp,
  };
};
