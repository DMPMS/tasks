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

export const useSignIn = () => {
  const { setUser } = useGlobalReducer();

  const { request, loadingRequest } = useRequest();
  const navigate = useNavigate();

  const [disabledButton, setDisabledButton] = useState<boolean>(true);
  const [signIn, setSignIn] = useState<SignInDto>(DEFAULT_SIGN_IN);

  useEffect(() => {
    if (signIn.email && signIn.password && isValidEmail(signIn.email)) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  }, [signIn]);

  const handleOnChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    nameObject: string
  ) => {
    const inputValue = e.target.value;

    setSignIn({
      ...signIn,
      [nameObject]:
        nameObject === "email" ? inputValue.toLowerCase() : inputValue,
    });
  };

  const handleOnSignIn = async (event: React.FormEvent) => {
    event.preventDefault();

    await request<AuthType>({
      method: MethodEnum.POST,
      url: URL_AUTH,
      body: signIn,
    }).then((data) => {
      setUser(data.user);
      setAuthorizationToken(data.token);
      navigate(AuthRedirectRoutesEnum.AUTH_REDIRECT);
    });
  };

  const handleOnSignUp = () => {
    navigate(SignUpRoutesEnum.SIGN_UP);
  };

  return {
    loadingRequest,
    disabledButton,
    handleOnChangeInput,
    handleOnSignIn,
    handleOnSignUp,
  };
};
