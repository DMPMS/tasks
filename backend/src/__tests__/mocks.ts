import { DeleteResult } from "typeorm";
import { CreateAuthDto } from "../dtos/creates/createAuthDto";
import { CreateCategoryDto } from "../dtos/creates/createCategoryDto";
import { ReturnAuthDto } from "../dtos/returns/returnAuthDto";
import { ReturnCategoryDto } from "../dtos/returns/returnCategoryDto";
import { UpdateCategoryDto } from "../dtos/updates/updateCategoryDto";

export const MOCK_ERROR_MESSAGES = {
  ERROR_TYPE_ERROR: "Error of type Error",
  UNEXPECTED_ERROR: "Unexpected Error",
};

export const MOCK_INVALIDS = {
  CATEGORY_ID: "invalid categoryId",
};

export const MOCK_RETURNS: {
  AUTH: ReturnAuthDto;
  CATEGORY: (id: number) => ReturnCategoryDto;
  CATEGORIES: ReturnCategoryDto[];
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
};

export const MOCK_CREATES: {
  AUTH: CreateAuthDto;
  CATEGORY: CreateCategoryDto;
} = {
  AUTH: {
    email: "test@test.com",
    password: "testPassword",
  },
  CATEGORY: {
    name: "Category name",
  },
};

export const MOCK_UPDATES: {
  CATEGORY: UpdateCategoryDto;
} = {
  CATEGORY: {
    name: "Category name",
  },
};

export const MOCK_DELETE: DeleteResult = {
  raw: [],
  affected: 1,
};
