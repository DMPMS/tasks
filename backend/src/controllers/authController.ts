import { AuthService } from "../services/authService";
import { CreateAuthDto } from "../dtos/creates/createAuthDto";
import { ERROR_MESSAGES } from "../utils/messages";
import { HttpStatusCodeEnum } from "../enums/HttpStatusCodeEnum";
import { Request, Response } from "express";
import { validateDto } from "../utils/validation";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const createAuthDto = Object.assign(new CreateAuthDto(), req.body);

      const isValid = await validateDto(createAuthDto, res);
      if (!isValid) {
        return;
      }

      const returnAuthDto = await this.authService.login(createAuthDto);

      res.status(HttpStatusCodeEnum.Created).json(returnAuthDto);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCodeEnum.BadRequest).send(error.message);
      } else {
        res
          .status(HttpStatusCodeEnum.InternalServerError)
          .send(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
      }
    }
  }
}
