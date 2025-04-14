import { DeleteResult, Repository } from "typeorm";
import { AppDataSource } from "../config/orm";
import { UserEntity } from "../entities/userEntity";
import { CreateUserDto } from "../dtos/creates/createUserDto";
import { ReturnUserDto } from "../dtos/returns/returnUserDto";
import { ERROR_MESSAGES } from "../utils/messages";
import { createPasswordHashed, validatePassword } from "../utils/password";
import { RelationsOptionsType } from "../types/RelationsOptions.type";
import { UserTypeEnum } from "../enums/UserTypeEnum";
import { PAGINATION } from "../config/constants";
import { CategoryService } from "./categoryService";
import { UpdateUserDto } from "../dtos/updates/updateUserDto";

export class UserService {
  private categoryService!: CategoryService;

  constructor(
    private readonly userRepository: Repository<UserEntity> = AppDataSource.getRepository(
      UserEntity
    )
  ) {}

  private getCategoryService(): CategoryService {
    if (!this.categoryService) {
      this.categoryService = new CategoryService();
    }
    return this.categoryService;
  }

  async getUsers(
    page: number,
    limit: number,
    relationsOptions?: RelationsOptionsType
  ): Promise<ReturnUserDto[]> {
    const skip = (page - PAGINATION.INITIAL_PAGE) * limit;

    const users = await this.userRepository.find({
      // skip,
      // take: limit,
      relations: relationsOptions,
      where: { userType: UserTypeEnum.User },
    });

    return users.map((user) => new ReturnUserDto(user));
  }

  async getUserById(
    userId: number,
    relationsOptions?: RelationsOptionsType
  ): Promise<ReturnUserDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId, userType: UserTypeEnum.User },
      relations: relationsOptions,
    });

    if (!user) {
      throw new Error(ERROR_MESSAGES.USER.USER_ID_NOT_FOUND(userId));
    }

    return new ReturnUserDto(user);
  }

  async getUserByEmail(
    email: string,
    relationsOptions?: RelationsOptionsType
  ): Promise<ReturnUserDto> {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
      relations: relationsOptions,
    });

    if (!user) {
      throw new Error(
        ERROR_MESSAGES.USER.USER_EMAIL_NOT_FOUND(email.toLowerCase())
      );
    }

    return new ReturnUserDto(user);
  }

  async createUser(
    createUserDto: CreateUserDto,
    userId?: number,
    userType?: UserTypeEnum
  ): Promise<ReturnUserDto> {
    const existingUser = await this.getUserByEmail(createUserDto.email).catch(
      () => undefined
    );

    if (existingUser) {
      throw new Error(ERROR_MESSAGES.USER.EMAIL_ALREADY_EXISTS);
    }

    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new Error(ERROR_MESSAGES.USER.PASSWORDS_DO_NOT_MATCH);
    }

    const passwordHashed = await createPasswordHashed(createUserDto.password);
    createUserDto.email = createUserDto.email.toLowerCase();

    let user;

    if (userId && userType === UserTypeEnum.Root) {
      const userRoot = await this.userRepository.findOne({
        where: { id: userId, userType: userType },
      });

      if (!userRoot) {
        throw new Error(ERROR_MESSAGES.USER.USER_ROOT_ID_NOT_FOUND(userId));
      } else {
        user = this.userRepository.create({
          ...createUserDto,
          userType: UserTypeEnum.Admin,
          password: passwordHashed,
        });
      }
    } else {
      user = this.userRepository.create({
        ...createUserDto,
        userType: UserTypeEnum.User,
        password: passwordHashed,
      });
    }

    const savedUser = await this.userRepository.save(user);

    await this.getCategoryService().createDefaultCategories(savedUser.id);

    return new ReturnUserDto(savedUser);
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto
  ): Promise<ReturnUserDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(ERROR_MESSAGES.USER.USER_ID_NOT_FOUND(userId));
    }

    updateUserDto.email = updateUserDto.email.toLowerCase();

    if (user.email !== updateUserDto.email) {
      const existingUser = await this.getUserByEmail(updateUserDto.email).catch(
        () => undefined
      );

      if (existingUser) {
        throw new Error(ERROR_MESSAGES.USER.EMAIL_ALREADY_EXISTS);
      }
    }

    if (updateUserDto.newPassword) {
      if (updateUserDto.newPassword !== updateUserDto.confirmNewPassword) {
        throw new Error(ERROR_MESSAGES.USER.PASSWORDS_DO_NOT_MATCH);
      }
    }

    const newPasswordHashed = updateUserDto.newPassword
      ? await createPasswordHashed(updateUserDto.newPassword)
      : undefined;

    const isMatch = await validatePassword(
      updateUserDto.password,
      user.password
    );

    if (!isMatch) {
      throw new Error(ERROR_MESSAGES.USER.INVALID_USER_PASSWORD);
    }

    const updatedUser = await this.userRepository.save({
      ...user,
      ...updateUserDto,
      password: newPasswordHashed ? newPasswordHashed : user.password,
    });

    return new ReturnUserDto(updatedUser);
  }

  async deleteUser(userDeleteId: number): Promise<DeleteResult> {
    await this.getUserById(userDeleteId);

    return this.userRepository.delete({ id: userDeleteId });
  }
}
