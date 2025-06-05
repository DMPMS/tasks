import { Response } from "express";
import { PAGINATION } from "../config/constants";
import { HttpStatusEnum } from "../enums/HttpStatusEnum";
import { CategoryService } from "../services/categoryService";
import { AuthenticatedRequest } from "../types/AuthenticatedRequestType";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utils/messages";
import { CreateCategoryDto } from "../dtos/creates/createCategoryDto";
import { validateDto } from "../utils/validation";
import { UpdateCategoryDto } from "../dtos/updates/updateCategoryDto";
import { plainToInstance } from "class-transformer";
import { HttpError } from "../utils/httpError";

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  async getUserCategories(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
      } = req.query;
      const userId = req.userId;

      if (!userId) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.CATEGORY.USER_ID_IS_REQUIRED);
        return;
      }

      const categories = await this.categoryService.getUserCategories(
        Number(page),
        Number(limit),
        userId
      );

      res.status(HttpStatusEnum.Ok).json(categories);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json(error.message);
      } else {
        res
          .status(HttpStatusEnum.InternalServerError)
          .json(ERROR_MESSAGES.CATEGORY.SELECT_CATEGORY_ERROR);
      }
    }
  }

  async getUserCategoryById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.userId;
      const { categoryId } = req.params;

      if (!userId) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.CATEGORY.USER_ID_IS_REQUIRED);
        return;
      }

      if (!categoryId) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.CATEGORY.CATEGORY_ID_IS_REQUIRED);
        return;
      }

      const categoryIdNumber = Number(categoryId);

      if (isNaN(categoryIdNumber)) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.CATEGORY.INVALID_CATEGORY_ID);
        return;
      }

      const category = await this.categoryService.getUserCategoryById(
        userId,
        categoryIdNumber
      );

      res.status(HttpStatusEnum.Ok).json(category);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json(error.message);
      } else {
        res
          .status(HttpStatusEnum.InternalServerError)
          .json(ERROR_MESSAGES.CATEGORY.SELECT_CATEGORY_BY_ID_ERROR);
      }
    }
  }

  async createCategory(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const createCategoryDto = plainToInstance(CreateCategoryDto, req.body, {
        excludeExtraneousValues: true,
      });

      const userId = req.userId;

      const isValid = await validateDto(createCategoryDto);
      if (!isValid) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.DTO.INVALID_DATA);
        return;
      }

      if (!userId) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.CATEGORY.USER_ID_IS_REQUIRED);
        return;
      }

      const savedCategory = await this.categoryService.createCategory(
        userId,
        createCategoryDto
      );

      res.status(HttpStatusEnum.Created).json(savedCategory);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json(error.message);
      } else {
        res
          .status(HttpStatusEnum.InternalServerError)
          .json(ERROR_MESSAGES.CATEGORY.CREATE_CATEGORY_ERROR);
      }
    }
  }

  async updateCategory(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const updateCategoryDto = plainToInstance(UpdateCategoryDto, req.body, {
        excludeExtraneousValues: true,
      });

      const userId = req.userId;
      const { categoryId } = req.params;

      const isValid = await validateDto(updateCategoryDto);
      if (!isValid) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.DTO.INVALID_DATA);
        return;
      }

      if (!userId) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.CATEGORY.USER_ID_IS_REQUIRED);
        return;
      }

      if (!categoryId) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.CATEGORY.CATEGORY_ID_IS_REQUIRED);
        return;
      }

      const categoryIdNumber = Number(categoryId);

      if (isNaN(categoryIdNumber)) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.CATEGORY.INVALID_CATEGORY_ID);
        return;
      }

      const updatedCategory = await this.categoryService.updateCategory(
        userId,
        categoryIdNumber,
        updateCategoryDto
      );

      res.status(HttpStatusEnum.Ok).json(updatedCategory);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json(error.message);
      } else {
        res
          .status(HttpStatusEnum.InternalServerError)
          .json(ERROR_MESSAGES.CATEGORY.UPDATE_CATEGORY_ERROR);
      }
    }
  }

  async deleteCategory(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.userId;
      const { categoryId } = req.params;

      if (!userId) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.CATEGORY.USER_ID_IS_REQUIRED);
        return;
      }

      if (!categoryId) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.CATEGORY.CATEGORY_ID_IS_REQUIRED);
        return;
      }

      const categoryIdNumber = Number(categoryId);

      if (isNaN(categoryIdNumber)) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.CATEGORY.INVALID_CATEGORY_ID);
        return;
      }

      await this.categoryService.deleteCategory(userId, categoryIdNumber);

      res
        .status(HttpStatusEnum.Ok)
        .json(SUCCESS_MESSAGES.CATEGORY.CATEGORY_DELETED_SUCCESSFULLY);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json(error.message);
      } else {
        res
          .status(HttpStatusEnum.InternalServerError)
          .json(ERROR_MESSAGES.CATEGORY.DELETE_CATEGORY_ERROR);
      }
    }
  }
}
