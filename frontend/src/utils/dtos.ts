import { PriorityEnum } from "../enums/PriorityEnum";

export const DEFAULT_SIGN_IN = {
  email: "",
  password: "",
};

export const DEFAULT_SIGN_UP = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const DEFAULT_CREATE_TASK = {
  categoryId: undefined,
  title: "",
  description: "",
  priority: PriorityEnum.Medium,
  limitDate: "",
};

export const DEFAULT_CREATE_CATEGORY = {
  name: "",
};
