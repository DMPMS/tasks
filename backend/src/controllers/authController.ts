import { plainToInstance } from "class-transformer";
import { AuthService } from "../services/authService";
import { LoginDto } from "../dtos/others/loginDto";
import { ERROR_MESSAGES } from "../utils/messages";
import { HttpStatusCodeEnum } from "../enums/HttpStatusCodeEnum";
import { Request, Response } from "express";
import { validateDto } from "../utils/validation";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginDto = plainToInstance(LoginDto, req.body);

      const isValid = await validateDto(loginDto, res);
      if (!isValid) {
        return;
      }

      const returnLoginDto = await this.authService.login(loginDto);

      res.status(HttpStatusCodeEnum.CREATED).json(returnLoginDto);
    } catch (error) {
      res
        .status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR)
        .send(ERROR_MESSAGES.USER.LOGIN_USER_ERROR);
    }
  }
}
