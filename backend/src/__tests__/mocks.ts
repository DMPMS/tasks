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

export const MOCK_ERROR_MESSAGES = {
  ERROR_TYPE_ERROR: "Error of type Error",
  UNEXPECTED_ERROR: "Unexpected Error",
};

export const MOCK_INVALIDS = {
  CATEGORY_ID: "invalid categoryId",
  TASK_ID: "invalid taskId",
};

export const MOCK_RETURNS: {
  AUTH: ReturnAuthDto;
  CATEGORY: (id: number) => ReturnCategoryDto;
  CATEGORIES: ReturnCategoryDto[];
  TASK: (id: number) => ReturnTaskDto;
  TASKS: ReturnTaskDto[];
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
};

export const MOCK_CREATES: {
  AUTH: CreateAuthDto;
  CATEGORY: CreateCategoryDto;
  TASK: CreateTaskDto;
} = {
  AUTH: {
    email: "test@test.com",
    password: "testPassword",
  },
  CATEGORY: {
    name: "Category name",
  },
  TASK: {
    categoryId: 1,
    title: "Task name",
    description: "Task description",
    priority: PriorityEnum.Low,
    limitDate: new Date("2025-05-10 18:00"),
  },
};

export const MOCK_UPDATES: {
  CATEGORY: UpdateCategoryDto;
  TASK: UpdateTaskDto;
  TASK_COMPLETED_DATE: UpdateTaskCompletedDateDto;
} = {
  CATEGORY: {
    name: "Category name",
  },
  TASK: {
    categoryId: 1,
    title: "Task name",
    description: "Task description",
    priority: PriorityEnum.Low,
    limitDate: new Date("2025-05-10 18:00"),
  },
  TASK_COMPLETED_DATE: {
    completedDate: null,
  },
};
