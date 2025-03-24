import { DeleteResult, Repository } from "typeorm";
import { UserService } from "./userService";
import { CategoryEntity } from "../entities/categoryEntity";
import { AppDataSource } from "../config/orm";
import { RelationsOptionsType } from "../types/RelationsOptions.type";
import { ReturnCategoryDto } from "../dtos/returns/returnCategoryDto";
import { CreateCategoryDto } from "../dtos/creates/createCategoryDto";
import { ERROR_MESSAGES } from "../utils/messages";

export class CategoryService {
  private readonly userService: UserService;

  constructor(
    private readonly categoryRepository: Repository<CategoryEntity> = AppDataSource.getRepository(
      CategoryEntity
    )
  ) {
    this.userService = new UserService();
  }

  async getUserCategories(
    page: number,
    limit: number,
    userId: number,
    relationsOptions?: RelationsOptionsType
  ): Promise<ReturnCategoryDto[]> {
    await this.userService.getUserById(userId);

    const skip = (page - 1) * limit;

    const categories = await this.categoryRepository.find({
      skip,
      take: limit,
      where: { userId: userId },
      relations: relationsOptions,
    });

    return categories.map((category) => new ReturnCategoryDto(category));
  }

  async getUserCategoryById(
    userId: number,
    categoryId: number,
    relationsOptions?: RelationsOptionsType
  ): Promise<ReturnCategoryDto> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId, userId: userId },
      relations: relationsOptions,
    });

    if (!category) {
      throw new Error(
        ERROR_MESSAGES.CATEGORY.CATEGORY_ID_NOT_FOUND(categoryId, userId)
      );
    }

    return new ReturnCategoryDto(category);
  }

  async createCategory(
    userId: number,
    createCategoryDto: CreateCategoryDto
  ): Promise<ReturnCategoryDto> {
    await this.userService.getUserById(userId);

    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name, userId: userId },
    });

    if (existingCategory) {
      throw new Error(ERROR_MESSAGES.CATEGORY.CATEGORY_ALREADY_EXISTS);
    }

    const category = this.categoryRepository.create({
      ...createCategoryDto,
      userId: userId,
    });

    const savedCategory = await this.categoryRepository.save(category);

    return new ReturnCategoryDto(savedCategory);
  }

  async deleteCategory(
    userId: number,
    categoryId: number
  ): Promise<DeleteResult> {
    await this.getUserCategoryById(userId, categoryId);

    return this.categoryRepository.delete({ id: categoryId });
  }
}
