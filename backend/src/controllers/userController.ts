import { Request, Response } from "express";
import { CreateUserDto } from "../dtos/creates/createUserDto";
import { UserService } from "../services/userService";
import { HttpStatusCodeEnum } from "../enums/HttpStatusCodeEnum";
import { PAGINATION } from "../config/constants";
import { ERROR_MESSAGES } from "../utils/messages";
import { validateDto } from "../utils/validation";
import { RelationsOptionsType } from "../types/RelationsOptions.type";
import { AuthenticatedRequest } from "../types/AuthenticatedRequestType";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async getUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
      } = req.query;

      const relationsOptions: RelationsOptionsType = {
        tasks: true,
      };

      const returnUsersDto = await this.userService.getUsers(
        Number(page),
        Number(limit),
        relationsOptions
      );

      res.status(HttpStatusCodeEnum.Ok).json(returnUsersDto);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCodeEnum.BadRequest).send(error.message);
      } else {
        res
          .status(HttpStatusCodeEnum.InternalServerError)
          .send(ERROR_MESSAGES.USER.SELECT_USER_ERROR);
      }
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const createUserDto = Object.assign(new CreateUserDto(), req.body);

      const isValid = await validateDto(createUserDto, res);
      if (!isValid) {
        return;
      }

      const returnUserDto = await this.userService.createUser(createUserDto);

      res.status(HttpStatusCodeEnum.Created).json(returnUserDto);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCodeEnum.BadRequest).send(error.message);
      } else {
        res
          .status(HttpStatusCodeEnum.InternalServerError)
          .send(ERROR_MESSAGES.USER.CREATE_USER_ERROR);
      }
    }
  }

  async createAdmin(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const createUserDto = Object.assign(new CreateUserDto(), req.body);
      const userId = req.userId;
      const userType = req.userType;

      const isValid = await validateDto(createUserDto, res);
      if (!isValid) {
        return;
      }

      if (!userId) {
        res
          .status(HttpStatusCodeEnum.BadRequest)
          .send(ERROR_MESSAGES.USER.USER_ID_IS_REQUIRED);
        return;
      }

      if (!userType) {
        res
          .status(HttpStatusCodeEnum.BadRequest)
          .send(ERROR_MESSAGES.USER.USER_TYPE_IS_REQUIRED);
        return;
      }

      const returnUserDto = await this.userService.createUser(
        createUserDto,
        userId,
        userType
      );

      res.status(HttpStatusCodeEnum.Created).json(returnUserDto);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCodeEnum.BadRequest).send(error.message);
      } else {
        res
          .status(HttpStatusCodeEnum.InternalServerError)
          .send(ERROR_MESSAGES.USER.CREATE_USER_ERROR);
      }
    }
  }
}
