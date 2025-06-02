import { CategoryDto } from "../dtos/categoryDto";
import { SignInDto } from "../dtos/signInDto";
import { SignUpDto } from "../dtos/signUpDto";
import { TaskDto } from "../dtos/taskDto";
import { UserDto } from "../dtos/userDto";
import { PriorityEnum } from "../enums/PriorityEnum";

export const DEFAULT_SIGN_IN: SignInDto = {
  email: "",
  password: "",
};

export const DEFAULT_SIGN_UP: SignUpDto = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const DEFAULT_TASK: TaskDto = {
  categoryId: undefined,
  title: "",
  description: "",
  priority: PriorityEnum.Medium,
  limitDate: "",
};

export const DEFAULT_CATEGORY: CategoryDto = {
  name: "",
};

export const DEFAULT_USER: UserDto = {
  name: "",
  email: "",
  newPassword: "",
  confirmNewPassword: "",
  password: "",
};
