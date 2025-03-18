import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { CreateUserDTO } from "../dtos/creates/createUserDto";
import { validate } from "class-validator";
import { ReturnUserDTO } from "../dtos/returns/returnUserDto";
import { UserService } from "../services/userService";
import { HttpStatusCodeEnum } from "../enums/HttpStatusCodeEnum";
import { PAGINATION } from "../config/constants";
import { ERROR_MESSAGES } from "../utils/messages";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
      } = req.query;

      const returnUsersDTO = await this.userService.getUsers(
        Number(page),
        Number(limit)
      );

      res.status(HttpStatusCodeEnum.OK).json(returnUsersDTO);
    } catch (error) {
      res
        .status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR)
        .send(ERROR_MESSAGES.SELECT_USER_ERROR);
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const createUserDTO = plainToInstance(CreateUserDTO, req.body);

      const errors = await validate(createUserDTO);
      if (errors.length > 0) {
        const formattedErrors = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        }));
        res
          .status(HttpStatusCodeEnum.BAD_REQUEST)
          .json({ errors: formattedErrors });
        return;
      }

      const savedUser = await this.userService.createUser(createUserDTO);

      const returnUserDTO = plainToInstance(ReturnUserDTO, savedUser, {
        excludeExtraneousValues: true,
      });

      res.status(HttpStatusCodeEnum.CREATED).json(returnUserDTO);
    } catch (error) {
      res
        .status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR)
        .send(ERROR_MESSAGES.CREATE_USER_ERROR);
    }
  }
}
