import { Request, Response } from "express";
import { CreateUserDto } from "../dtos/creates/createUserDto";
import { UserService } from "../services/userService";
import { HttpStatusEnum } from "../enums/HttpStatusEnum";
import { PAGINATION } from "../config/constants";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utils/messages";
import { validateDto } from "../utils/validation";
import { AuthenticatedRequest } from "../types/AuthenticatedRequestType";
import { plainToInstance } from "class-transformer";
import { UpdateUserDto } from "../dtos/updates/updateUserDto";
import { DeleteUserDto } from "../dtos/deletes/deleteUserDto";
import { HttpError } from "../utils/httpError";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async getUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
      } = req.query;

      const users = await this.userService.getUsers(
        Number(page),
        Number(limit)
      );

      res.status(HttpStatusEnum.Ok).json(users);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json(error.message);
      } else {
        res
          .status(HttpStatusEnum.InternalServerError)
          .json(ERROR_MESSAGES.USER.SELECT_USER_ERROR);
      }
    }
  }

  async getUserInfo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.USER.USER_ID_IS_REQUIRED);
        return;
      }

      const user = await this.userService.getUserInfo(userId);

      res.status(HttpStatusEnum.Ok).json(user);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json(error.message);
      } else {
        res
          .status(HttpStatusEnum.InternalServerError)
          .json(ERROR_MESSAGES.USER.SELECT_USER_INFO_ERROR);
      }
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const createUserDto = plainToInstance(CreateUserDto, req.body, {
        excludeExtraneousValues: true,
      });

      const isValid = await validateDto(createUserDto);
      if (!isValid) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.DTO.INVALID_DATA);
        return;
      }

      const savedUser = await this.userService.createUser(createUserDto);

      res.status(HttpStatusEnum.Created).json(savedUser);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json(error.message);
      } else {
        res
          .status(HttpStatusEnum.InternalServerError)
          .json(ERROR_MESSAGES.USER.CREATE_USER_ERROR);
      }
    }
  }

  async createAdmin(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const createUserDto = plainToInstance(CreateUserDto, req.body, {
        excludeExtraneousValues: true,
      });

      const userId = req.userId;
      const userType = req.userType;

      const isValid = await validateDto(createUserDto);
      if (!isValid) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.DTO.INVALID_DATA);
        return;
      }

      if (!userId) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.USER.USER_ID_IS_REQUIRED);
        return;
      }

      if (!userType) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.USER.USER_TYPE_IS_REQUIRED);
        return;
      }

      const savedUser = await this.userService.createUser(
        createUserDto,
        userId,
        userType
      );

      res.status(HttpStatusEnum.Created).json(savedUser);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json(error.message);
      } else {
        res
          .status(HttpStatusEnum.InternalServerError)
          .json(ERROR_MESSAGES.USER.CREATE_USER_ERROR);
      }
    }
  }

  async updateUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const updateUserDto = plainToInstance(UpdateUserDto, req.body, {
        excludeExtraneousValues: true,
      });

      const userId = req.userId;

      const isValid = await validateDto(updateUserDto);
      if (!isValid) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.DTO.INVALID_DATA);
        return;
      }

      if (!userId) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.USER.USER_ID_IS_REQUIRED);
        return;
      }

      const updatedUser = await this.userService.updateUser(
        userId,
        updateUserDto
      );

      res.status(HttpStatusEnum.Ok).json(updatedUser);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json(error.message);
      } else {
        res
          .status(HttpStatusEnum.InternalServerError)
          .json(ERROR_MESSAGES.USER.UPDATE_USER_ERROR);
      }
    }
  }

  async deleteUserMy(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const deleteUserDto = plainToInstance(DeleteUserDto, req.body, {
        excludeExtraneousValues: true,
      });

      const userId = req.userId;

      const isValid = await validateDto(deleteUserDto);
      if (!isValid) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.DTO.INVALID_DATA);
        return;
      }

      if (!userId) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.USER.USER_ID_IS_REQUIRED);
        return;
      }

      await this.userService.deleteUserMy(userId, deleteUserDto);

      res
        .status(HttpStatusEnum.Ok)
        .json(SUCCESS_MESSAGES.USER.USER_MY_DELETED_SUCCESSFULLY);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json(error.message);
      } else {
        res
          .status(HttpStatusEnum.InternalServerError)
          .json(ERROR_MESSAGES.USER.DELETE_USER_MY_ERROR);
      }
    }
  }

  async deleteUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { userDeleteId } = req.params;

      if (!userDeleteId) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.USER.USER_DELETE_ID_IS_REQUIRED);
        return;
      }

      const userDeleteIdNumber = Number(userDeleteId);

      if (isNaN(userDeleteIdNumber)) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.USER.INVALID_USER_DELETE_ID);
        return;
      }

      await this.userService.deleteUser(userDeleteIdNumber);

      res
        .status(HttpStatusEnum.Ok)
        .json(SUCCESS_MESSAGES.USER.USER_DELETED_SUCCESSFULLY);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json(error.message);
      } else {
        res
          .status(HttpStatusEnum.InternalServerError)
          .json(ERROR_MESSAGES.USER.DELETE_USER_ERROR);
      }
    }
  }

  async deleteAdmin(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { adminDeleteId } = req.params;

      if (!adminDeleteId) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.USER.ADMIN_DELETE_ID_IS_REQUIRED);
        return;
      }

      const adminDeleteIdNumber = Number(adminDeleteId);

      if (isNaN(adminDeleteIdNumber)) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.USER.INVALID_ADMIN_DELETE_ID);
        return;
      }

      await this.userService.deleteAdmin(adminDeleteIdNumber);

      res
        .status(HttpStatusEnum.Ok)
        .json(SUCCESS_MESSAGES.USER.ADMIN_DELETED_SUCCESSFULLY);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json(error.message);
      } else {
        res
          .status(HttpStatusEnum.InternalServerError)
          .json(ERROR_MESSAGES.USER.DELETE_ADMIN_ERROR);
      }
    }
  }
}
