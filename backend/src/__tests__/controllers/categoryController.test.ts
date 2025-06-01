import { Response } from "express";
import { HttpStatusCodeEnum } from "../../enums/HttpStatusCodeEnum";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../utils/messages";
import { validateDto } from "../../utils/validation";
import { plainToInstance } from "class-transformer";
import { CategoryController } from "../../controllers/categoryController";
import { CategoryService } from "../../services/categoryService";
import { CreateCategoryDto } from "../../dtos/creates/createCategoryDto";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequestType";
import { UpdateCategoryDto } from "../../dtos/updates/updateCategoryDto";
import {
  MOCK_CREATES,
  MOCK_DEFAULTS,
  MOCK_ERROR_MESSAGES,
  MOCK_INVALIDS,
  MOCK_RETURNS,
  MOCK_UPDATES,
} from "../mocks";
import { ReturnCategoryDto } from "../../dtos/returns/returnCategoryDto";
import { PAGINATION } from "../../config/constants";
import { validate } from "class-validator";

jest.mock("../../utils/validation");
jest.mock("class-transformer");

describe("CategoryController", () => {
  let categoryController: CategoryController;
  let categoryServiceMock: jest.Mocked<CategoryService>;
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    categoryServiceMock = {
      getUserCategories: jest.fn(),
      getUserCategoryById: jest.fn(),
      createCategory: jest.fn(),
      updateCategory: jest.fn(),
      deleteCategory: jest.fn(),
    } as unknown as jest.Mocked<CategoryService>;

    categoryController = new CategoryController(categoryServiceMock);

    req = {
      params: {},
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    (validateDto as jest.Mock).mockImplementation(async (dto) => {
      const errors = await validate(dto);

      if (errors.length > 0) {
        const formattedErrors = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        }));

        console.log("Validation errors:", formattedErrors);

        return false;
      }
      return true;
    });
  });

  it("getUserCategories - Should return ReturnCategoryDto[] on get user categories successfully (200)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      query: {
        page: MOCK_DEFAULTS.REQ.QUERY.PAGE,
        limit: MOCK_DEFAULTS.REQ.QUERY.LIMIT,
      },
    };

    const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } =
      req.query || {};
    const userId = req.userId;

    categoryServiceMock.getUserCategories.mockResolvedValue(
      MOCK_RETURNS.CATEGORIES
    );

    await categoryController.getUserCategories(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(categoryServiceMock.getUserCategories).toHaveBeenCalledWith(
      Number(page),
      Number(limit),
      userId
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.Ok);
    expect(res.json).toHaveBeenCalledWith(MOCK_RETURNS.CATEGORIES);
  });

  it("getUserCategories - Should use default pagination values if not defined", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
    };

    const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } =
      req.query || {};
    const userId = req.userId;

    await categoryController.getUserCategories(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(categoryServiceMock.getUserCategories).toHaveBeenCalledWith(
      Number(page),
      Number(limit),
      userId
    );
  });

  it("getUserCategories - Should return an error if the userId is missing (400)", async () => {
    req = {
      ...req,
      query: {
        page: MOCK_DEFAULTS.REQ.QUERY.PAGE,
        limit: MOCK_DEFAULTS.REQ.QUERY.LIMIT,
      },
    };

    await categoryController.getUserCategories(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.CATEGORY.USER_ID_IS_REQUIRED
    );
  });

  it("getUserCategories - Should return an error if an error of type Error occurs (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      query: {
        page: MOCK_DEFAULTS.REQ.QUERY.PAGE,
        limit: MOCK_DEFAULTS.REQ.QUERY.LIMIT,
      },
    };

    categoryServiceMock.getUserCategories.mockRejectedValue(
      new Error(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR)
    );

    await categoryController.getUserCategories(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR);
  });

  it("getUserCategories - Should return an error if an unexpected error occurs (500)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      query: {
        page: MOCK_DEFAULTS.REQ.QUERY.PAGE,
        limit: MOCK_DEFAULTS.REQ.QUERY.LIMIT,
      },
    };

    categoryServiceMock.getUserCategories.mockRejectedValue(
      MOCK_ERROR_MESSAGES.UNEXPECTED_ERROR
    );

    await categoryController.getUserCategories(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(
      HttpStatusCodeEnum.InternalServerError
    );
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.CATEGORY.SELECT_CATEGORY_ERROR
    );
  });

  it("getUserCategoryById - Should return ReturnCategoryDto on get user category by id successfully (200)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { categoryId: MOCK_DEFAULTS.REQ.PARAMS.CATEGORY_ID },
    };

    const userId = req.userId;
    const categoryIdNumber = Number(req.params?.categoryId);

    categoryServiceMock.getUserCategoryById.mockResolvedValue(
      MOCK_RETURNS.CATEGORY(categoryIdNumber)
    );

    await categoryController.getUserCategoryById(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(categoryServiceMock.getUserCategoryById).toHaveBeenCalledWith(
      userId,
      categoryIdNumber
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.Ok);
    expect(res.json).toHaveBeenCalledWith(
      MOCK_RETURNS.CATEGORY(categoryIdNumber)
    );
  });

  it("getUserCategoryById - Should return an error if the userId is missing (400)", async () => {
    await categoryController.getUserCategoryById(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.CATEGORY.USER_ID_IS_REQUIRED
    );
  });

  it("getUserCategoryById - Should return an error if the categoryId is missing (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
    };

    await categoryController.getUserCategoryById(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.CATEGORY.CATEGORY_ID_IS_REQUIRED
    );
  });

  it("getUserCategoryById - Should return an error if the categoryId is invalid (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { categoryId: MOCK_INVALIDS.CATEGORY_ID },
    };

    await categoryController.getUserCategoryById(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.CATEGORY.INVALID_CATEGORY_ID
    );
  });

  it("getUserCategoryById - Should return an error if an error of type Error occurs (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { categoryId: MOCK_DEFAULTS.REQ.PARAMS.CATEGORY_ID },
    };

    categoryServiceMock.getUserCategoryById.mockRejectedValue(
      new Error(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR)
    );

    await categoryController.getUserCategoryById(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR);
  });

  it("getUserCategoryById - Should return an error if an unexpected error occurs (500)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { categoryId: MOCK_DEFAULTS.REQ.PARAMS.CATEGORY_ID },
    };

    categoryServiceMock.getUserCategoryById.mockRejectedValue(
      MOCK_ERROR_MESSAGES.UNEXPECTED_ERROR
    );

    await categoryController.getUserCategoryById(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(
      HttpStatusCodeEnum.InternalServerError
    );
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.CATEGORY.SELECT_CATEGORY_BY_ID_ERROR
    );
  });

  it("createCategory - Should return ReturnCategoryDto on create category successfully (201)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      body: MOCK_CREATES.CATEGORY,
    };

    const createCategoryDto = Object.assign(new CreateCategoryDto(), req.body);

    const userId = req.userId;

    const mockedCategory: ReturnCategoryDto = {
      ...req.body,
      id: 1,
    };

    (plainToInstance as jest.Mock).mockReturnValue(createCategoryDto);
    categoryServiceMock.createCategory.mockResolvedValue(mockedCategory);

    await categoryController.createCategory(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(plainToInstance).toHaveBeenCalledWith(CreateCategoryDto, req.body, {
      excludeExtraneousValues: true,
    });
    expect(validateDto).toHaveBeenCalledWith(createCategoryDto);
    expect(categoryServiceMock.createCategory).toHaveBeenCalledWith(
      userId,
      expect.any(CreateCategoryDto)
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.Created);
    expect(res.json).toHaveBeenCalledWith(mockedCategory);
  });

  it("createCategory - Should return an error if the data is invalid (400)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(false);

    await categoryController.createCategory(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(ERROR_MESSAGES.DTO.INVALID_DATA);
  });

  it("createCategory - Should return an error if the userId is missing (400)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(true);

    await categoryController.createCategory(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.CATEGORY.USER_ID_IS_REQUIRED
    );
  });

  it("createCategory - Should return an error if an error of type Error occurs (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
    };

    (validateDto as jest.Mock).mockResolvedValue(true);
    categoryServiceMock.createCategory.mockRejectedValue(
      new Error(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR)
    );

    await categoryController.createCategory(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR);
  });

  it("createCategory - Should return an error if an unexpected error occurs (500)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
    };

    (validateDto as jest.Mock).mockResolvedValue(true);
    categoryServiceMock.createCategory.mockRejectedValue(
      MOCK_ERROR_MESSAGES.UNEXPECTED_ERROR
    );

    await categoryController.createCategory(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(
      HttpStatusCodeEnum.InternalServerError
    );
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.CATEGORY.CREATE_CATEGORY_ERROR
    );
  });

  it("updateCategory - Should return ReturnCategoryDto on update category successfully (200)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      body: MOCK_UPDATES.CATEGORY,
      params: { categoryId: MOCK_DEFAULTS.REQ.PARAMS.CATEGORY_ID },
    };

    const updateCategoryDto = Object.assign(new UpdateCategoryDto(), req.body);

    const userId = req.userId;
    const categoryIdNumber = Number(req.params?.categoryId);

    const mockedCategory: ReturnCategoryDto = {
      ...req.body,
      id: categoryIdNumber,
    };

    (plainToInstance as jest.Mock).mockReturnValue(updateCategoryDto);
    categoryServiceMock.updateCategory.mockResolvedValue(mockedCategory);

    await categoryController.updateCategory(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(plainToInstance).toHaveBeenCalledWith(UpdateCategoryDto, req.body, {
      excludeExtraneousValues: true,
    });
    expect(validateDto).toHaveBeenCalledWith(updateCategoryDto);
    expect(categoryServiceMock.updateCategory).toHaveBeenCalledWith(
      userId,
      categoryIdNumber,
      expect.any(UpdateCategoryDto)
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.Ok);
    expect(res.json).toHaveBeenCalledWith(mockedCategory);
  });

  it("updateCategory - Should return an error if the data is invalid (400)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(false);

    await categoryController.updateCategory(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(ERROR_MESSAGES.DTO.INVALID_DATA);
  });

  it("updateCategory - Should return an error if the userId is missing (400)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(true);

    await categoryController.updateCategory(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.CATEGORY.USER_ID_IS_REQUIRED
    );
  });

  it("updateCategory - Should return an error if the categoryId is missing (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
    };

    (validateDto as jest.Mock).mockResolvedValue(true);

    await categoryController.updateCategory(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.CATEGORY.CATEGORY_ID_IS_REQUIRED
    );
  });

  it("updateCategory - Should return an error if the categoryId is invalid (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { categoryId: MOCK_INVALIDS.CATEGORY_ID },
    };

    (validateDto as jest.Mock).mockResolvedValue(true);

    await categoryController.updateCategory(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.CATEGORY.INVALID_CATEGORY_ID
    );
  });

  it("updateCategory - Should return an error if an error of type Error occurs (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { categoryId: MOCK_DEFAULTS.REQ.PARAMS.CATEGORY_ID },
    };

    (validateDto as jest.Mock).mockResolvedValue(true);
    categoryServiceMock.updateCategory.mockRejectedValue(
      new Error(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR)
    );

    await categoryController.updateCategory(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR);
  });

  it("updateCategory - Should return an error if an unexpected error occurs (500)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { categoryId: MOCK_DEFAULTS.REQ.PARAMS.CATEGORY_ID },
    };

    (validateDto as jest.Mock).mockResolvedValue(true);
    categoryServiceMock.updateCategory.mockRejectedValue(
      MOCK_ERROR_MESSAGES.UNEXPECTED_ERROR
    );

    await categoryController.updateCategory(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(
      HttpStatusCodeEnum.InternalServerError
    );
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.CATEGORY.UPDATE_CATEGORY_ERROR
    );
  });

  it("deleteCategory - Should delete the category successfully (200)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { categoryId: MOCK_DEFAULTS.REQ.PARAMS.CATEGORY_ID },
    };

    const userId = req.userId;
    const categoryIdNumber = Number(req.params?.categoryId);

    await categoryController.deleteCategory(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(categoryServiceMock.deleteCategory).toHaveBeenCalledWith(
      userId,
      categoryIdNumber
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.Ok);
    expect(res.send).toHaveBeenCalledWith(
      SUCCESS_MESSAGES.CATEGORY.CATEGORY_DELETED_SUCCESSFULLY
    );
  });

  it("deleteCategory - Should return an error if the userId is missing (400)", async () => {
    await categoryController.deleteCategory(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.CATEGORY.USER_ID_IS_REQUIRED
    );
  });

  it("deleteCategory - Should return an error if the categoryId is missing (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
    };

    await categoryController.deleteCategory(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.CATEGORY.CATEGORY_ID_IS_REQUIRED
    );
  });

  it("deleteCategory - Should return an error if the categoryId is invalid (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { categoryId: MOCK_INVALIDS.CATEGORY_ID },
    };

    await categoryController.deleteCategory(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.CATEGORY.INVALID_CATEGORY_ID
    );
  });

  it("deleteCategory - Should return an error if an error of type Error occurs (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { categoryId: MOCK_DEFAULTS.REQ.PARAMS.CATEGORY_ID },
    };

    categoryServiceMock.deleteCategory.mockRejectedValue(
      new Error(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR)
    );

    await categoryController.deleteCategory(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR);
  });

  it("deleteCategory - Should return an error if an unexpected error occurs (500)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { categoryId: MOCK_DEFAULTS.REQ.PARAMS.CATEGORY_ID },
    };

    categoryServiceMock.deleteCategory.mockRejectedValue(
      MOCK_ERROR_MESSAGES.UNEXPECTED_ERROR
    );

    await categoryController.deleteCategory(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(
      HttpStatusCodeEnum.InternalServerError
    );
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.CATEGORY.DELETE_CATEGORY_ERROR
    );
  });
});
