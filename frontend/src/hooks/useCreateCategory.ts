import { useNavigate } from "react-router-dom";
import { useCategoryReducer } from "../store/reducers/categoryReducer/useCategoryReducer";
import { useGlobalReducer } from "../store/reducers/globalReducer/useGlobalReducer";
import { useRequest } from "../utils/functions/request";
import { useCategory } from "./useCategory";
import { useEffect, useState } from "react";
import { CategoryDto } from "../dtos/categoryDto";
import { DEFAULT_CATEGORY } from "../utils/dtos";
import { CategoryType } from "../types/CategoryType";
import { MethodEnum } from "../enums/MethodEnum";
import { URL_CATEGORY, URL_CATEGORY_ID } from "../config/urls";
import { AxiosError } from "axios";
import {
  ERROR_MESSAGES,
  FIELD_VALIDATION_MESSAGES,
  SUCCESS_MESSAGES,
} from "../utils/messages";
import { NotificationEnum } from "../enums/NotificationEnum";
import { FieldValidationType } from "../types/FieldValidationType";
import { CATEGORY } from "../config/constants";
import { CategoryRoutesEnum } from "../routes/categoryRoutes";
import { useTask } from "./useTask";

export const useCreateCategory = (categoryId?: string) => {
  const { setNotification } = useGlobalReducer();

  const { category: categoryReducer, setCategory: setCategoryReducer } =
    useCategoryReducer();

  const { categories, fetchCategories } = useCategory();
  const { fetchTasks } = useTask();

  const { request, loadingRequest } = useRequest();
  const navigate = useNavigate();

  const [loadingCategory, setLoadingCategory] = useState<boolean>(true);
  const [disabledButton, setDisabledButton] = useState<boolean>(true);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [category, setCategory] = useState<CategoryDto>(DEFAULT_CATEGORY);

  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [warningFields, setWarningFields] = useState<string[]>([]);

  const [userCategoryNames, setUserCategoryNames] = useState<string[]>([]);

  useEffect(() => {
    if (categoryId) {
      const findAndSetCategoryReducer = async (categoryId: string) => {
        await request<CategoryType>({
          method: MethodEnum.Get,
          url: URL_CATEGORY_ID.replace(":categoryId", categoryId),
          timeout: 1000,
        })
          .then(async (data) => {
            setCategoryReducer(data);
            setLoadingCategory(false);
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
      findAndSetCategoryReducer(categoryId);
    } else {
      setIsEdit(false);
      setCategoryReducer(undefined);
      setLoadingCategory(false);
    }
  }, [categoryId]);

  useEffect(() => {
    if (categoryReducer) {
      setCategory({ name: categoryReducer.name });

      const fieldsToValidate: FieldValidationType[] = [
        { id: "name", value: categoryReducer.name },
      ];

      fieldsToValidate.forEach((item) => {
        handleValidateOnEdit(item);
      });
    } else {
      setCategory(DEFAULT_CATEGORY);
      setInvalidFields([]);
      setWarningFields([]);
    }
  }, [categoryReducer]);

  useEffect(() => {
    const newUserCategoryNames = categories.map((category) => category.name);

    if (
      JSON.stringify(newUserCategoryNames) !== JSON.stringify(userCategoryNames)
    ) {
      setUserCategoryNames(newUserCategoryNames);
    }
  }, [categories]);

  useEffect(() => {
    if (
      category.name.length >= CATEGORY.NAME_LENGTH.MIN &&
      category.name.length <= CATEGORY.NAME_LENGTH.MAX
    ) {
      if (
        userCategoryNames.includes(category.name) &&
        category.name === categoryReducer?.name
      ) {
        setDisabledButton(false);
      } else if (!userCategoryNames.includes(category.name)) {
        setDisabledButton(false);
      } else {
        setDisabledButton(true);
      }
    } else {
      setDisabledButton(true);
    }
  }, [category]);

  const validateInputField = (
    name: string,
    value: string,
    input: HTMLInputElement
  ) => {
    if (!["name"].includes(name)) {
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
    } else if (name === "name") {
      if (value.length < CATEGORY.NAME_LENGTH.MIN) {
        input.setCustomValidity(
          FIELD_VALIDATION_MESSAGES.CATEGORY.NAME.MIN_CHARACTER(
            CATEGORY.NAME_LENGTH.MIN
          )
        );
        setInvalidFields((prev) => [...prev, name]);
      } else if (value.length > CATEGORY.NAME_LENGTH.MAX) {
        input.setCustomValidity(
          FIELD_VALIDATION_MESSAGES.CATEGORY.NAME.MAX_CHARACTER(
            CATEGORY.NAME_LENGTH.MAX
          )
        );
        setInvalidFields((prev) => [...prev, name]);
      } else if (
        userCategoryNames.includes(value) &&
        value !== categoryReducer?.name
      ) {
        input.setCustomValidity(
          FIELD_VALIDATION_MESSAGES.CATEGORY.NAME.CATEGORY_ALREADY_EXISTS
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

    setCategory({
      ...category,
      [name]: value,
    });

    validateInputField(name, value, input);
  };

  const handleOnCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (categoryId) {
      await request<CategoryType>({
        method: MethodEnum.Put,
        url: URL_CATEGORY_ID.replace(":categoryId", categoryId),
        body: category,
        timeout: 1000,
      })
        .then(async () => {
          await fetchCategories(0);
          await fetchTasks(0);

          setNotification({
            message: SUCCESS_MESSAGES.CATEGORY.CATEGORY_UPDATED_SUCCESSFULLY,
            type: NotificationEnum.Success,
          });

          navigate(CategoryRoutesEnum.Categories);
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
      await request<CategoryType>({
        method: MethodEnum.Post,
        url: URL_CATEGORY,
        body: category,
        timeout: 1000,
      })
        .then(async () => {
          await fetchCategories(0);

          setNotification({
            message: SUCCESS_MESSAGES.CATEGORY.CATEGORY_CREATED_SUCCESSFULLY,
            type: NotificationEnum.Success,
          });

          navigate(CategoryRoutesEnum.Categories);
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
    setCategory(DEFAULT_CATEGORY);
    setInvalidFields([]);
    setWarningFields([]);
  };

  const handleOnCancel = () => {
    navigate(CategoryRoutesEnum.Categories);
  };

  return {
    category,
    loadingCategory,
    loadingRequest,
    disabledButton,
    isEdit,
    invalidFields,
    warningFields,
    handleOnChangeInput,
    handleOnCreate,
    handleOnReset,
    handleOnCancel,
  };
};
