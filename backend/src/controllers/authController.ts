import { AuthService } from "../services/authService";
import { CreateAuthDto } from "../dtos/creates/createAuthDto";
import { ERROR_MESSAGES } from "../utils/messages";
import { HttpStatusCodeEnum } from "../enums/HttpStatusCodeEnum";
import { Request, Response } from "express";
import { validateDto } from "../utils/validation";
import { plainToInstance } from "class-transformer";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const createAuthDto = plainToInstance(CreateAuthDto, req.body, {
        excludeExtraneousValues: true,
      });

      const isValid = await validateDto(createAuthDto);
      if (!isValid) {
        res
          .status(HttpStatusCodeEnum.BadRequest)
          .json(ERROR_MESSAGES.DTO.INVALID_DATA);
        return;
      }

      const returnAuthDto = await this.authService.login(createAuthDto);

      res.status(HttpStatusCodeEnum.Created).json(returnAuthDto);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCodeEnum.BadRequest).json(error.message);
      } else {
        res
          .status(HttpStatusCodeEnum.InternalServerError)
          .json(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
      }
    }
  }
}
