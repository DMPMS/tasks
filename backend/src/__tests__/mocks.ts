import { DeleteResult } from "typeorm";
import { CreateAuthDto } from "../dtos/creates/createAuthDto";
import { CreateCategoryDto } from "../dtos/creates/createCategoryDto";
import { ReturnAuthDto } from "../dtos/returns/returnAuthDto";
import { ReturnCategoryDto } from "../dtos/returns/returnCategoryDto";
import { UpdateCategoryDto } from "../dtos/updates/updateCategoryDto";
import { CreateTaskDto } from "../dtos/creates/createTaskDto";
import { PriorityEnum } from "../enums/PriorityEnum";
import { UpdateTaskDto } from "../dtos/updates/updateTaskDto";
import { UpdateTaskCompletedDateDto } from "../dtos/updates/updateTaskCompletedDateDto";
import { ReturnTaskDto } from "../dtos/returns/returnTaskDto";
import { ReturnUserDto } from "../dtos/returns/returnUserDto";
import { CreateUserDto } from "../dtos/creates/createUserDto";
import { UpdateUserDto } from "../dtos/updates/updateUserDto";
import { DeleteUserDto } from "../dtos/deletes/deleteUserDto";

export const MOCK_ERROR_MESSAGES = {
  ERROR_TYPE_ERROR: "Error of type Error",
  UNEXPECTED_ERROR: "Unexpected Error",
};

export const MOCK_INVALIDS = {
  CATEGORY_ID: "invalid categoryId",
  USER_DELETE_ID: "invalid userDeleteId",
  ADMIN_DELETE_ID: "invalid adminDeleteId",
  TASK_ID: "invalid taskId",
};

export const MOCK_DEFAULTS = {
  REQ: {
    USER_ID: 1,
    PARAMS: {
      TASK_ID: "1",
      CATEGORY_ID: "1",
      USER_DELETE_ID: "1",
      ADMIN_DELETE_ID: "1",
    },
    QUERY: {
      PAGE: "1",
      LIMIT: "5",
    },
  },
};

export const MOCK_RETURNS: {
  AUTH: ReturnAuthDto;
  CATEGORY: (id: number) => ReturnCategoryDto;
  CATEGORIES: ReturnCategoryDto[];
  TASK: (id: number) => ReturnTaskDto;
  TASKS: ReturnTaskDto[];
  USER: (id: number) => ReturnUserDto;
  USERS: ReturnUserDto[];
} = {
  AUTH: {
    token: "Bearer testToken",
  },
  CATEGORY: (id) => ({
    id: id,
    name: "Category name",
  }),
  CATEGORIES: [
    { id: 1, name: "Category 1" },
    { id: 2, name: "Category 2" },
  ],
  TASK: (id) => ({
    id: id,
    title: "Task 2",
    description: "",
    priority: PriorityEnum.High,
    limitDate: new Date("2025-05-10 18:00"),
    category: {
      id: 1,
      name: "Category name",
    },
  }),
  TASKS: [
    {
      id: 1,
      title: "Task 1",
      description: "Task 1 description",
      priority: PriorityEnum.Low,
      limitDate: new Date("2025-05-10 18:00"),
    },
    {
      id: 2,
      title: "Task 2",
      description: "",
      priority: PriorityEnum.High,
      limitDate: new Date("2025-05-10 18:00"),
      category: {
        id: 1,
        name: "Category name",
      },
    },
  ],
  USER: (id) => ({
    id: id,
    name: "User name",
    email: "user@email.com",
  }),
  USERS: [
    {
      id: 1,
      name: "User 1",
      email: "user1@email.com",
    },
    {
      id: 2,
      name: "User 2",
      email: "user2@email.com",
    },
  ],
};

export const MOCK_CREATES: {
  AUTH: CreateAuthDto;
  CATEGORY: CreateCategoryDto;
  USER: CreateUserDto;
  ADMIN: CreateUserDto;
  TASK: CreateTaskDto;
} = {
  AUTH: {
    email: "test@test.com",
    password: "testPassword",
  },
  CATEGORY: {
    name: "Category name",
  },
  USER: {
    name: "User name",
    email: "user@email.com",
    password: "userPassword",
    confirmPassword: "userPassword",
  },
  ADMIN: {
    name: "Admin name",
    email: "admin@email.com",
    password: "adminPassword",
    confirmPassword: "adminPassword",
  },
  TASK: {
    categoryId: 1,
    title: "Task name",
    description: "Task description",
    priority: PriorityEnum.Low,
    limitDate: "2025-05-10 18:00",
  },
};

export const MOCK_UPDATES: {
  CATEGORY: UpdateCategoryDto;
  USER: UpdateUserDto;
  TASK: UpdateTaskDto;
  TASK_COMPLETED_DATE: UpdateTaskCompletedDateDto;
} = {
  CATEGORY: {
    name: "Category name",
  },
  USER: {
    name: "User name",
    email: "user@email.com",
    newPassword: "newPassword",
    confirmNewPassword: "newPassword",
    password: "oldPassword",
  },
  TASK: {
    categoryId: 1,
    title: "Task name",
    description: "Task description",
    priority: PriorityEnum.Low,
    limitDate: "2025-05-10 18:00",
  },
  TASK_COMPLETED_DATE: {
    completedDate: "2025-05-12 12:00",
  },
};

export const MOCK_DELETES: {
  USER: DeleteUserDto;
} = {
  USER: {
    password: "userPassword",
  },
};
