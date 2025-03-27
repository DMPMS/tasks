import { useGlobalReducer } from "../store/reducers/globalReducer/useGlobalReducer";
import { useUserReducer } from "../store/reducers/userReducer/useUserReducer";
import { useRequest } from "../utils/functions/request";
import { useEffect, useState } from "react";
import { UserType } from "../types/UserType";
import { MethodEnum } from "../enums/MethodEnum";
import { URL_USER, URL_USER_ID } from "../config/urls";
import { AxiosError } from "axios";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utils/messages";
import { NotificationEnum } from "../enums/NotificationEnum";

export const useUser = () => {
  const { setNotification } = useGlobalReducer();
  const { users, setUsers } = useUserReducer();

  const { request, loadingRequest } = useRequest();

  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [userIdDelete, setUserIdDelete] = useState<number | undefined>(
    undefined
  );
  const [searchValue, setSearchValue] = useState<string>("");

  const usersFiltered = users.filter((user) =>
    user.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const fetchUsers = async (timetout: number) => {
    await request<UserType[]>({
      method: MethodEnum.Get,
      url: URL_USER,
      timeout: timetout,
    })
      .then((data) => {
        setUsers(data);
        setLoadingUsers(false);
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

  useEffect(() => {
    if (!users || users.length === 0) {
      fetchUsers(1000);
    } else {
      setLoadingUsers(false);
    }
  }, []);

  const handleOnSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleOnDelete = async () => {
    await request<void>({
      method: MethodEnum.Delete,
      url: URL_USER_ID.replace(":userId", `${userIdDelete}`),
      timeout: 1000,
    })
      .then(async () => {
        await fetchUsers(0);

        setNotification({
          message: SUCCESS_MESSAGES.USER.USER_DELETED_SUCCESSFULLY,
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

    setUserIdDelete(undefined);
  };

  const handleOnCloseModalDelete = () => {
    setUserIdDelete(undefined);
  };

  const handleOnOpenModalDelete = (userId: number) => {
    setUserIdDelete(userId);
  };

  return {
    loadingUsers,
    loadingRequest,
    users: usersFiltered,
    handleOnSearch,
    handleOnDelete,
    openModalDelete: !!userIdDelete,
    handleOnOpenModalDelete,
    handleOnCloseModalDelete,
    fetchUsers,
  };
};
