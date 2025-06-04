import { Repository } from "typeorm";
import { AppDataSource } from "../config/orm";
import { UserEntity } from "../entities/userEntity";
import { validatePassword } from "../utils/password";
import jwt from "jsonwebtoken";
import { ERROR_MESSAGES } from "../utils/messages";
import { CreateAuthDto } from "../dtos/creates/createAuthDto";
import { StringValue } from "ms";
import { ReturnAuthDto } from "../dtos/returns/returnAuthDto";
import { HttpError } from "../utils/httpError";
import { HttpStatusEnum } from "../enums/HttpStatusEnum";

export class AuthService {
  constructor(
    private readonly userRepository: Repository<UserEntity> = AppDataSource.getRepository(
      UserEntity
    )
  ) {}

  async login(createAuthDto: CreateAuthDto): Promise<ReturnAuthDto> {
    const user = await this.userRepository.findOne({
      where: { email: createAuthDto.email.toLowerCase() },
    });

    if (!user) {
      throw new HttpError(
        HttpStatusEnum.Unauthorized,
        ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS
      );
    }

    const isMatch = await validatePassword(
      createAuthDto.password,
      user.password
    );

    if (!isMatch) {
      throw new HttpError(
        HttpStatusEnum.Unauthorized,
        ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS
      );
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new HttpError(
        HttpStatusEnum.InternalServerError,
        ERROR_MESSAGES.ENV.MISSING_JWT_SECRET
      );
    }

    const jwtExpiresIn = process.env.JWT_EXPIRES_IN as StringValue;

    if (!jwtExpiresIn) {
      throw new HttpError(
        HttpStatusEnum.InternalServerError,
        ERROR_MESSAGES.ENV.MISSING_JWT_EXPIRES_IN
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userType: user.userType,
      },
      jwtSecret,
      {
        expiresIn: jwtExpiresIn,
      }
    );

    return new ReturnAuthDto({ token: `Bearer ${token}` });
  }
}
