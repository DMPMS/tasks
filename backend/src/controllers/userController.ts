import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { CreateUserDto } from "../dtos/creates/createUserDto";
import { UserService } from "../services/userService";
import { HttpStatusCodeEnum } from "../enums/HttpStatusCodeEnum";
import { PAGINATION } from "../config/constants";
import { ERROR_MESSAGES } from "../utils/messages";
import { validateDto } from "../utils/validation";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
      } = req.query;

      const returnUsersDto = await this.userService.getUsers(
        Number(page),
        Number(limit)
      );

      res.status(HttpStatusCodeEnum.OK).json(returnUsersDto);
    } catch (error) {
      res
        .status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR)
        .send(ERROR_MESSAGES.USER.SELECT_USER_ERROR);
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const createUserDto = plainToInstance(CreateUserDto, req.body);

      const isValid = await validateDto(createUserDto, res);
      if (!isValid) {
        return;
      }

      const returnUserDto = await this.userService.createUser(createUserDto);

      res.status(HttpStatusCodeEnum.CREATED).json(returnUserDto);
    } catch (error) {
      res
        .status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR)
        .send(ERROR_MESSAGES.USER.CREATE_USER_ERROR);
    }
  }
}
