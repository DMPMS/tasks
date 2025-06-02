import { Repository } from "typeorm";
import {
  MOCK_CREATES,
  MOCK_DATABASE_CREATES,
  MOCK_DATABASE_RETURNS,
  MOCK_DEFAULTS,
  MOCK_DELETE_RESULT,
  MOCK_RETURNS,
  MOCK_UPDATES,
} from "../mocks";
import { CategoryService } from "../../services/categoryService";
import { CategoryEntity } from "../../entities/categoryEntity";
import { UserService } from "../../services/userService";
import { ReturnCategoryDto } from "../../dtos/returns/returnCategoryDto";
import { ERROR_MESSAGES } from "../../utils/messages";
import { CATEGORY, PAGINATION } from "../../config/constants";

describe("CategoryService", () => {
  let categoryService: CategoryService;
  let userServiceMock: jest.Mocked<UserService>;
  let categoryRepositoryMock: jest.Mocked<Repository<CategoryEntity>>;

  beforeEach(() => {
    categoryRepositoryMock = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<CategoryEntity>>;

    userServiceMock = {
      getUserById: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    categoryService = new CategoryService(categoryRepositoryMock);
    // @ts-ignore
    categoryService.userService = userServiceMock;
  });

  it("Should instantiate CategoryService without args", () => {
    const service = new CategoryService();

    expect(service).toBeInstanceOf(CategoryService);
  });

  it("getUserCategories - Should return ReturnCategoryDto[] on get user categories successfully", async () => {
    const page = MOCK_DEFAULTS.PAGE;
    const limit = MOCK_DEFAULTS.LIMIT;
    const userId = MOCK_DEFAULTS.USER_ID;
    const relationsOptions = {};

    const skip = (page - PAGINATION.INITIAL_PAGE) * limit;

    const categories = MOCK_DATABASE_RETURNS.CATEGORIES(userId);

    categoryRepositoryMock.find.mockResolvedValue(categories);

    const result = await categoryService.getUserCategories(
      page,
      limit,
      userId,
      relationsOptions
    );

    expect(userServiceMock.getUserById).toHaveBeenCalledWith(userId);
    expect(categoryRepositoryMock.find).toHaveBeenCalledWith({
      // skip,
      // take: limit,
      where: { userId: userId },
      order: { name: "ASC", id: "DESC" },
      relations: relationsOptions,
    });
    expect(Array.isArray(result)).toBe(true);
    result.forEach((item) => expect(item).toBeInstanceOf(ReturnCategoryDto));
    expect(result).toEqual(
      categories.map((category) => new ReturnCategoryDto(category))
    );
  });

  it("getUserCategoryById - Should return ReturnCategoryDto on get user category by id successfully", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;
    const categoryId = MOCK_DEFAULTS.CATEGORY_ID;
    const relationsOptions = {};

    const category = MOCK_DATABASE_RETURNS.CATEGORY(categoryId, userId);

    categoryRepositoryMock.findOne.mockResolvedValue(category);

    const result = await categoryService.getUserCategoryById(
      userId,
      categoryId,
      relationsOptions
    );

    expect(userServiceMock.getUserById).toHaveBeenCalledWith(userId);
    expect(categoryRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: categoryId, userId: userId },
      relations: relationsOptions,
    });
    expect(result).toBeInstanceOf(ReturnCategoryDto);
    expect(result).toEqual(new ReturnCategoryDto(category));
  });

  it("getUserCategoryById - Should throw an error if the category is not found", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;
    const categoryId = MOCK_DEFAULTS.CATEGORY_ID;
    const relationsOptions = {};

    const category = null;

    categoryRepositoryMock.findOne.mockResolvedValue(category);

    await expect(
      categoryService.getUserCategoryById(userId, categoryId, relationsOptions)
    ).rejects.toThrow(
      ERROR_MESSAGES.CATEGORY.CATEGORY_ID_NOT_FOUND(categoryId, userId)
    );
  });

  it("createCategory - Should return ReturnCategoryDto on create category successfully", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;
    const createCategoryDto = MOCK_CREATES.CATEGORY;

    const existingCategory = null;

    const savedCategory = MOCK_DATABASE_CREATES.CATEGORY(
      createCategoryDto,
      MOCK_DEFAULTS.CATEGORY_ID,
      userId
    );

    categoryRepositoryMock.findOne.mockResolvedValue(existingCategory);
    categoryRepositoryMock.save.mockResolvedValue(savedCategory);

    const result = await categoryService.createCategory(
      userId,
      createCategoryDto
    );

    expect(userServiceMock.getUserById).toHaveBeenCalledWith(userId);
    expect(categoryRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { name: createCategoryDto.name, userId: userId },
    });
    expect(categoryRepositoryMock.save).toHaveBeenCalledWith({
      ...createCategoryDto,
      userId,
    });
    expect(result).toBeInstanceOf(ReturnCategoryDto);
    expect(result).toEqual(new ReturnCategoryDto(savedCategory));
  });

  it("createCategory - Should throw an error if existing category", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;
    const createCategoryDto = MOCK_CREATES.CATEGORY;

    const existingCategory = MOCK_DATABASE_RETURNS.CATEGORY(
      MOCK_DEFAULTS.CATEGORY_ID,
      userId
    );

    categoryRepositoryMock.findOne.mockResolvedValue(existingCategory);

    await expect(
      categoryService.createCategory(userId, createCategoryDto)
    ).rejects.toThrow(ERROR_MESSAGES.CATEGORY.CATEGORY_ALREADY_EXISTS);
  });

  it("updateCategory - Should return ReturnCategoryDto on update category successfully", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;
    const categoryId = MOCK_DEFAULTS.CATEGORY_ID;
    const updateCategoryDto = MOCK_UPDATES.CATEGORY;

    const category = MOCK_RETURNS.CATEGORY(categoryId);

    const existingCategory = MOCK_DATABASE_RETURNS.CATEGORY(categoryId, userId);

    const updatedCategory: ReturnCategoryDto & CategoryEntity = {
      ...category,
      ...updateCategoryDto,
      userId: userId,
      createdAt: MOCK_DEFAULTS.DATE,
      updatedAt: MOCK_DEFAULTS.DATE,
      user: undefined,
      tasks: undefined,
    };

    categoryService.getUserCategoryById = jest.fn().mockResolvedValue(category);
    categoryRepositoryMock.findOne.mockResolvedValue(existingCategory);
    categoryRepositoryMock.save.mockResolvedValue(updatedCategory);

    const result = await categoryService.updateCategory(
      userId,
      categoryId,
      updateCategoryDto
    );

    expect(userServiceMock.getUserById).toHaveBeenCalledWith(userId);
    expect(categoryService.getUserCategoryById).toHaveBeenCalledWith(
      userId,
      categoryId
    );
    expect(categoryRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { name: updateCategoryDto.name, userId: userId },
    });
    expect(categoryRepositoryMock.save).toHaveBeenCalledWith({
      ...category,
      ...updateCategoryDto,
    });

    expect(result).toBeInstanceOf(ReturnCategoryDto);
    expect(result).toEqual(new ReturnCategoryDto(updatedCategory));
  });

  it("updateCategory - Should throw an error if existing category", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;
    const categoryId = MOCK_DEFAULTS.CATEGORY_ID;
    const updateCategoryDto = MOCK_UPDATES.CATEGORY; // "Category name"

    const category = {
      ...MOCK_RETURNS.CATEGORY(categoryId),
      name: "Old Category name",
    };

    const existingCategory = {
      ...MOCK_DATABASE_RETURNS.CATEGORY(categoryId, userId),
      id: categoryId + 1,
      name: updateCategoryDto.name,
    };

    categoryService.getUserCategoryById = jest.fn().mockResolvedValue(category);
    categoryRepositoryMock.findOne.mockResolvedValue(existingCategory);

    await expect(
      categoryService.updateCategory(userId, categoryId, updateCategoryDto)
    ).rejects.toThrow(ERROR_MESSAGES.CATEGORY.CATEGORY_ALREADY_EXISTS);
  });

  it("createDefaultCategories - Should create default categories for the user", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;

    const defaultCategories = CATEGORY.DEFAULT_CATEGORIES.map((category) => ({
      name: category,
      userId: userId,
    }));

    await categoryService.createDefaultCategories(userId);

    expect(userServiceMock.getUserById).toHaveBeenCalledWith(userId);
    expect(categoryRepositoryMock.save).toHaveBeenCalledWith(defaultCategories);
  });

  it("deleteCategory - Should return DeleteResult on delete category successfully", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;
    const categoryId = MOCK_DEFAULTS.CATEGORY_ID;

    categoryService.getUserCategoryById = jest
      .fn()
      .mockResolvedValue(MOCK_DATABASE_RETURNS.CATEGORY(categoryId, userId));
    categoryRepositoryMock.delete.mockResolvedValue(MOCK_DELETE_RESULT);

    const result = await categoryService.deleteCategory(userId, categoryId);

    expect(userServiceMock.getUserById).toHaveBeenCalledWith(userId);
    expect(categoryService.getUserCategoryById).toHaveBeenCalledWith(
      userId,
      categoryId
    );
    expect(categoryRepositoryMock.delete).toHaveBeenCalledWith({
      id: categoryId,
    });
    expect(result).toEqual(MOCK_DELETE_RESULT);
  });
});
