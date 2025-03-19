import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";
import { AppDataSource } from "../config/orm";
import { User } from "../entities/userEntity";
import { CreateUserDto } from "../dtos/creates/createUserDto";
import { ReturnUserDto } from "../dtos/returns/returnUserDto";
import { ERROR_MESSAGES } from "../utils/messages";
import { createPasswordHashed } from "../utils/password";

export class UserService {
  constructor(
    private readonly userRepository: Repository<User> = AppDataSource.getRepository(
      User
    )
  ) {}

  async getUsers(page: number, limit: number): Promise<ReturnUserDto[]> {
    const skip = (page - 1) * limit;

    const users = await this.userRepository.find({
      skip,
      take: limit,
    });

    return plainToInstance(ReturnUserDto, users, {
      excludeExtraneousValues: true,
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new Error(ERROR_MESSAGES.USER.EMAIL_ALREADY_EXISTS);
    }

    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new Error(ERROR_MESSAGES.USER.PASSWORDS_DO_NOT_MATCH);
    }

    const passwordHashed = await createPasswordHashed(createUserDto.password);

    const user = this.userRepository.create({
      ...createUserDto,
      password: passwordHashed,
    });

    const savedUser = await this.userRepository.save(user);

    return plainToInstance(ReturnUserDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }
}
