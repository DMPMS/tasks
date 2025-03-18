import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";
import { AppDataSource } from "../config/orm";
import { User } from "../entities/userEntity";
import { CreateUserDTO } from "../dtos/creates/createUserDto";
import { ReturnUserDTO } from "../dtos/returns/returnUserDto";
import { ERROR_MESSAGES } from "../utils/messages";

export class UserService {
  constructor(
    private readonly userRepository: Repository<User> = AppDataSource.getRepository(
      User
    )
  ) {}

  async getUsers(page: number, limit: number): Promise<ReturnUserDTO[]> {
    const skip = (page - 1) * limit;

    const users = await this.userRepository.find({
      skip,
      take: limit,
    });

    return plainToInstance(ReturnUserDTO, users, {
      excludeExtraneousValues: true,
    });
  }

  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDTO.email,
    });

    if (existingUser) {
      throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const user = this.userRepository.create(createUserDTO);
    return await this.userRepository.save(user);
  }
}
