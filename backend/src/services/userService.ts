import { Repository } from "typeorm";
import { AppDataSource } from "../config/orm";
import { UserEntity } from "../entities/userEntity";
import { CreateUserDto } from "../dtos/creates/createUserDto";
import { ReturnUserDto } from "../dtos/returns/returnUserDto";
import { ERROR_MESSAGES } from "../utils/messages";
import { createPasswordHashed } from "../utils/password";
import { RelationsOptionsType } from "../types/RelationsOptions.type";
import { UserTypeEnum } from "../enums/UserTypeEnum";

export class UserService {
  constructor(
    private readonly userRepository: Repository<UserEntity> = AppDataSource.getRepository(
      UserEntity
    )
  ) {}

  async getUsers(
    page: number,
    limit: number,
    relationsOptions?: RelationsOptionsType
  ): Promise<ReturnUserDto[]> {
    const skip = (page - 1) * limit;

    const users = await this.userRepository.find({
      skip,
      take: limit,
      relations: relationsOptions,
      where: { userType: UserTypeEnum.USER },
    });

    return users.map((user) => new ReturnUserDto(user));
  }

  async getUserById(
    userId: number,
    relationsOptions?: RelationsOptionsType
  ): Promise<ReturnUserDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: relationsOptions,
    });

    if (!user) {
      throw new Error(ERROR_MESSAGES.USER.USER_ID_NOT_FOUND(userId));
    }

    return new ReturnUserDto(user);
  }

  async createUser(
    createUserDto: CreateUserDto,
    userId?: number,
    userType?: UserTypeEnum
  ): Promise<ReturnUserDto> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new Error(ERROR_MESSAGES.USER.EMAIL_ALREADY_EXISTS);
    }

    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new Error(ERROR_MESSAGES.USER.PASSWORDS_DO_NOT_MATCH);
    }

    const passwordHashed = await createPasswordHashed(createUserDto.password);

    let user;

    if (userId && userType === UserTypeEnum.ROOT) {
      const userRoot = await this.userRepository.findOne({
        where: { id: userId, userType: userType },
      });

      if (!userRoot) {
        throw new Error(ERROR_MESSAGES.USER.USER_ROOT_ID_NOT_FOUND(userId));
      } else {
        user = this.userRepository.create({
          ...createUserDto,
          userType: UserTypeEnum.ADMIN,
          password: passwordHashed,
        });
      }
    } else {
      user = this.userRepository.create({
        ...createUserDto,
        userType: UserTypeEnum.USER,
        password: passwordHashed,
      });
    }

    const savedUser = await this.userRepository.save(user);

    return new ReturnUserDto(savedUser);
  }
}
