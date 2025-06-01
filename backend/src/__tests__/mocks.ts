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
import { UserEntity } from "../entities/userEntity";
import { UserTypeEnum } from "../enums/UserTypeEnum";
import { CategoryEntity } from "../entities/categoryEntity";
import { DeleteResult } from "typeorm";
import { TaskEntity } from "../entities/taskEntity";

const defaultDateString = "2025-05-10 18:00";

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
  PAGE: 1,
  LIMIT: 5,
  TOKEN: "mockToken",
  DATE: new Date(defaultDateString),
  USER_ID: 1,
  USER_DELETE_ID: 1,
  ADMIN_DELETE_ID: 1,
  CATEGORY_ID: 1,
  TASK_ID: 1,
};

export const MOCK_DATABASE_RETURNS: {
  USER: (id: number) => UserEntity;
  ADMIN: (id: number) => UserEntity;
  ROOT: (id: number) => UserEntity;
  USERS: UserEntity[];
  CATEGORY: (id: number, userId: number) => CategoryEntity;
  CATEGORIES: (userId: number) => CategoryEntity[];
  TASK: (id: number, userId: number) => TaskEntity;
  TASKS: (userId: number) => TaskEntity[];
} = {
  USER: (id) => ({
    id: id,
    name: "User name",
    email: "user@email.com",
    password: "hashedPassword",
    userType: UserTypeEnum.User,
    createdAt: MOCK_DEFAULTS.DATE,
    updatedAt: MOCK_DEFAULTS.DATE,
  }),
  ADMIN: (id) => ({
    id: id,
    name: "Admin name",
    email: "admin@email.com",
    password: "hashedPassword",
    userType: UserTypeEnum.Admin,
    createdAt: MOCK_DEFAULTS.DATE,
    updatedAt: MOCK_DEFAULTS.DATE,
  }),
  ROOT: (id) => ({
    id: id,
    name: "Root name",
    email: "root@email.com",
    password: "hashedPassword",
    userType: UserTypeEnum.Root,
    createdAt: MOCK_DEFAULTS.DATE,
    updatedAt: MOCK_DEFAULTS.DATE,
  }),
  USERS: [
    {
      id: 1,
      name: "User 1",
      email: "user1@email.com",
      password: "hashedPassword",
      userType: UserTypeEnum.User,
      createdAt: MOCK_DEFAULTS.DATE,
      updatedAt: MOCK_DEFAULTS.DATE,
    },
    {
      id: 2,
      name: "User 2",
      email: "user2@email.com",
      password: "hashedPassword",
      userType: UserTypeEnum.User,
      createdAt: MOCK_DEFAULTS.DATE,
      updatedAt: MOCK_DEFAULTS.DATE,
    },
  ],
  CATEGORY: (id, userId) => ({
    id: id,
    name: "Category name",
    userId: userId,
    createdAt: MOCK_DEFAULTS.DATE,
    updatedAt: MOCK_DEFAULTS.DATE,
  }),
  CATEGORIES: (userId) => [
    {
      id: 1,
      name: "Category 1",
      userId: userId,
      createdAt: MOCK_DEFAULTS.DATE,
      updatedAt: MOCK_DEFAULTS.DATE,
    },
    {
      id: 2,
      name: "Category 2",
      userId: userId,
      createdAt: MOCK_DEFAULTS.DATE,
      updatedAt: MOCK_DEFAULTS.DATE,
    },
  ],
  TASK: (id, userId) => ({
    id: id,
    categoryId: 1,
    userId: userId,
    title: "Task name",
    description: "Task description",
    priority: PriorityEnum.Low,
    limitDate: MOCK_DEFAULTS.DATE,
    completedDate: null,
    createdAt: MOCK_DEFAULTS.DATE,
    updatedAt: MOCK_DEFAULTS.DATE,
  }),
  TASKS: (userId) => [
    {
      id: 1,
      categoryId: 1,
      userId: userId,
      title: "Task 1",
      description: "Task 1 description",
      priority: PriorityEnum.Low,
      limitDate: MOCK_DEFAULTS.DATE,
      completedDate: null,
      createdAt: MOCK_DEFAULTS.DATE,
      updatedAt: MOCK_DEFAULTS.DATE,
    },
    {
      id: 2,
      categoryId: null,
      userId: userId,
      title: "Task 2",
      description: "Task 2 description",
      priority: PriorityEnum.High,
      limitDate: MOCK_DEFAULTS.DATE,
      completedDate: MOCK_DEFAULTS.DATE,
      createdAt: MOCK_DEFAULTS.DATE,
      updatedAt: MOCK_DEFAULTS.DATE,
    },
  ],
};

export const MOCK_DATABASE_CREATES: {
  CATEGORY: (
    createCategoryDto: CreateCategoryDto,
    id: number,
    userId: number
  ) => CategoryEntity;
  TASK: (
    createTaskDto: CreateTaskDto,
    id: number,
    userId: number
  ) => TaskEntity;
  USER: (
    createUserDto: CreateUserDto,
    id: number,
    userType: UserTypeEnum,
    password: string
  ) => UserEntity;
} = {
  CATEGORY: (createCategoryDto, id, userId) => ({
    ...createCategoryDto,
    id: id,
    userId: userId,
    createdAt: MOCK_DEFAULTS.DATE,
    updatedAt: MOCK_DEFAULTS.DATE,
  }),
  TASK: (createTaskDto, id, userId) => ({
    ...createTaskDto,
    id: id,
    categoryId: createTaskDto.categoryId ? createTaskDto.categoryId : null,
    description: createTaskDto.description ? createTaskDto.description : null,
    limitDate: new Date(createTaskDto.limitDate),
    completedDate: null,
    userId: userId,
    createdAt: MOCK_DEFAULTS.DATE,
    updatedAt: MOCK_DEFAULTS.DATE,
  }),
  USER: (createUserDto, id, userType, password) => ({
    ...createUserDto,
    id: id,
    userType: userType,
    password: password,
    createdAt: MOCK_DEFAULTS.DATE,
    updatedAt: MOCK_DEFAULTS.DATE,
  }),
};

export const MOCK_RETURNS: {
  AUTH: (token: string) => ReturnAuthDto;
  CATEGORY: (id: number) => ReturnCategoryDto;
  CATEGORIES: ReturnCategoryDto[];
  TASK: (id: number) => ReturnTaskDto;
  TASKS: ReturnTaskDto[];
  USER: (id: number) => ReturnUserDto;
  USERS: ReturnUserDto[];
} = {
  AUTH: (token) => ({
    token: `Bearer ${token}`,
  }),
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
    title: "Task name",
    description: "",
    priority: PriorityEnum.High,
    limitDate: MOCK_DEFAULTS.DATE,
    completedDate: undefined,
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
      limitDate: MOCK_DEFAULTS.DATE,
      completedDate: undefined,
    },
    {
      id: 2,
      title: "Task 2",
      description: "",
      priority: PriorityEnum.High,
      limitDate: MOCK_DEFAULTS.DATE,
      completedDate: MOCK_DEFAULTS.DATE,
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
    limitDate: defaultDateString,
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
    limitDate: defaultDateString,
  },
  TASK_COMPLETED_DATE: {
    completedDate: defaultDateString,
  },
};

export const MOCK_DELETES: {
  USER: DeleteUserDto;
} = {
  USER: {
    password: "userPassword",
  },
};

export const MOCK_DELETE_RESULT: DeleteResult = {
  raw: {},
  affected: 1,
};
