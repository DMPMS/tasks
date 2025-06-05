import { useNavigate } from "react-router-dom";
import { useCategoryReducer } from "../store/reducers/categoryReducer/useCategoryReducer";
import { useGlobalReducer } from "../store/reducers/globalReducer/useGlobalReducer";
import { useRequest } from "../utils/functions/request";
import { useEffect, useState } from "react";
import { CategoryType } from "../types/CategoryType";
import { MethodEnum } from "../enums/MethodEnum";
import { URL_CATEGORY, URL_CATEGORY_ID } from "../config/urls";
import { AxiosError } from "axios";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utils/messages";
import { NotificationEnum } from "../enums/NotificationEnum";
import { CategoryRoutesEnum } from "../routes/categoryRoutes";
import { useTask } from "./useTask";
import { logout } from "../utils/functions/auth";

export const useCategory = () => {
  const { setNotification } = useGlobalReducer();
  const { categories, setCategories } = useCategoryReducer();

  const { fetchTasks } = useTask();

  const { request, loadingRequest } = useRequest();
  const navigate = useNavigate();

  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [categoryIdDelete, setCategoryIdDelete] = useState<number | undefined>(
    undefined
  );
  const [searchValue, setSearchValue] = useState<string>("");

  const categoriesFiltered = categories.filter((category) =>
    category.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const fetchCategories = async (timetout: number) => {
    await request<CategoryType[]>({
      method: MethodEnum.Get,
      url: URL_CATEGORY,
      timeout: timetout,
    })
      .then((data) => {
        setCategories(data);
        setLoadingCategories(false);
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
    if (!categories || categories.length === 0) {
      fetchCategories(1000);
    } else {
      setLoadingCategories(false);
    }
  }, []);

  const handleOnCreate = () => {
    navigate(CategoryRoutesEnum.CreateCategory);
  };

  const handleOnUpdate = (categoryId: number) => {
    navigate(
      CategoryRoutesEnum.UpdateCategory.replace(":categoryId", `${categoryId}`)
    );
  };

  const handleOnSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleOnDelete = async () => {
    await request<void>({
      method: MethodEnum.Delete,
      url: URL_CATEGORY_ID.replace(":categoryId", `${categoryIdDelete}`),
      timeout: 1000,
    })
      .then(async () => {
        await fetchCategories(0);
        await fetchTasks(0);

        setNotification({
          message: SUCCESS_MESSAGES.CATEGORY.CATEGORY_DELETED_SUCCESSFULLY,
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

    setCategoryIdDelete(undefined);
  };

  const handleOnCloseModalDelete = () => {
    setCategoryIdDelete(undefined);
  };

  const handleOnOpenModalDelete = (categoryId: number) => {
    setCategoryIdDelete(categoryId);
  };

  return {
    loadingCategories,
    loadingRequest,
    categories: categoriesFiltered,
    handleOnCreate,
    handleOnUpdate,
    handleOnSearch,
    handleOnDelete,
    openModalDelete: !!categoryIdDelete,
    handleOnOpenModalDelete,
    handleOnCloseModalDelete,
    fetchCategories,
  };
};
