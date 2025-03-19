import { Repository } from "typeorm";
import { AppDataSource } from "../config/orm";
import { UserEntity } from "../entities/userEntity";
import { validatePassword } from "../utils/password";
import jwt from "jsonwebtoken";
import { ERROR_MESSAGES } from "../utils/messages";
import { LoginDto } from "../dtos/others/loginDto";
import { StringValue } from "ms";
import { ReturnLoginDto } from "../dtos/returns/returnLoginDto";
import { ReturnUserDto } from "../dtos/returns/returnUserDto";

export class AuthService {
  constructor(
    private readonly userRepository: Repository<UserEntity> = AppDataSource.getRepository(
      UserEntity
    )
  ) {}

  async login(loginDto: LoginDto): Promise<ReturnLoginDto> {
    const user = await this.userRepository.findOneBy({ email: loginDto.email });

    if (!user) {
      throw new Error(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const isMatch = await validatePassword(loginDto.password, user.password);

    if (!isMatch) {
      throw new Error(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    if (!process.env.JWT_SECRET) {
      throw new Error(ERROR_MESSAGES.AUTH.MISSING_JWT_SECRET);
    }

    const jwtSecret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN as StringValue;

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
      expiresIn: expiresIn,
    });

    return { user: new ReturnUserDto(user), token: token };
  }
}
