import { Repository } from "typeorm";
import { UserService } from "../../services/userService";
import { UserEntity } from "../../entities/userEntity";
import {
  MOCK_CREATES,
  MOCK_DATABASE_CREATES,
  MOCK_DATABASE_RETURNS,
  MOCK_DEFAULTS,
  MOCK_DELETE_RESULT,
  MOCK_DELETES,
  MOCK_RETURNS,
  MOCK_UPDATES,
} from "../mocks";
import { PAGINATION } from "../../config/constants";
import { UserTypeEnum } from "../../enums/UserTypeEnum";
import { ReturnUserDto } from "../../dtos/returns/returnUserDto";
import { ERROR_MESSAGES } from "../../utils/messages";
import { createPasswordHashed, validatePassword } from "../../utils/password";
import { CategoryService } from "../../services/categoryService";

jest.mock("../../utils/password");

describe("UserService", () => {
  let userService: UserService;
  let userRepositoryMock: jest.Mocked<Repository<UserEntity>>;
  let categoryServiceMock: jest.Mocked<CategoryService>;

  beforeEach(() => {
    userRepositoryMock = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<UserEntity>>;

    categoryServiceMock = {
      createDefaultCategories: jest.fn(),
    } as unknown as jest.Mocked<CategoryService>;

    userService = new UserService(userRepositoryMock);
    userService["getCategoryService"] = jest
      .fn()
      .mockReturnValue(categoryServiceMock);
  });

  it("Should instantiate UserService without args", () => {
    const service = new UserService();

    expect(service).toBeInstanceOf(UserService);
  });

  it("getCategoryService - Should instantiate CategoryService if dont exists", () => {
    const userService = new UserService();

    const categoryService = userService["getCategoryService"]();

    expect(categoryService.constructor.name).toBe("CategoryService");
  });

  it("getUsers - Should return ReturnUserDto[] on get users successfully", async () => {
    const page = MOCK_DEFAULTS.PAGE;
    const limit = MOCK_DEFAULTS.LIMIT;
    const relationsOptions = {};

    const skip = (page - PAGINATION.INITIAL_PAGE) * limit;

    const users = MOCK_DATABASE_RETURNS.USERS;

    userRepositoryMock.find.mockResolvedValue(users);

    const result = await userService.getUsers(page, limit, relationsOptions);

    expect(userRepositoryMock.find).toHaveBeenCalledWith({
      // skip,
      // take: limit,
      where: { userType: UserTypeEnum.User },
      relations: relationsOptions,
    });
    expect(Array.isArray(result)).toBe(true);
    result.forEach((item) => expect(item).toBeInstanceOf(ReturnUserDto));
    expect(result).toEqual(users.map((user) => new ReturnUserDto(user)));
  });

  it("getUserInfo - Should return ReturnUserDto on get user info successfully", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;
    const relationsOptions = {};

    const user = MOCK_DATABASE_RETURNS.USER(userId);

    userRepositoryMock.findOne.mockResolvedValue(user);

    const result = await userService.getUserInfo(userId, relationsOptions);

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: userId },
      relations: relationsOptions,
    });
    expect(result).toBeInstanceOf(ReturnUserDto);
    expect(result).toEqual(new ReturnUserDto(user));
  });

  it("getUserInfo - Should throw an error if the user is not found", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;
    const relationsOptions = {};

    const user = null;

    userRepositoryMock.findOne.mockResolvedValue(user);

    await expect(
      userService.getUserInfo(userId, relationsOptions)
    ).rejects.toThrow(ERROR_MESSAGES.USER.USER_ID_NOT_FOUND(userId));
  });

  it("getUserById - Should return ReturnUserDto on get user by id successfully", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;
    const relationsOptions = {};

    const user = MOCK_DATABASE_RETURNS.USER(userId);

    userRepositoryMock.findOne.mockResolvedValue(user);

    const result = await userService.getUserById(userId, relationsOptions);

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: userId, userType: UserTypeEnum.User },
      relations: relationsOptions,
    });
    expect(result).toBeInstanceOf(ReturnUserDto);
    expect(result).toEqual(new ReturnUserDto(user));
  });

  it("getUserById - Should throw an error if the user is not found", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;
    const relationsOptions = {};

    const user = null;

    userRepositoryMock.findOne.mockResolvedValue(user);

    await expect(
      userService.getUserById(userId, relationsOptions)
    ).rejects.toThrow(ERROR_MESSAGES.USER.USER_ID_NOT_FOUND(userId));
  });

  it("getUserByEmail - Should return ReturnUserDto on get user by email successfully", async () => {
    const email = MOCK_DATABASE_RETURNS.USER(MOCK_DEFAULTS.USER_ID).email;
    const relationsOptions = {};

    const user = MOCK_DATABASE_RETURNS.USER(MOCK_DEFAULTS.USER_ID);

    userRepositoryMock.findOne.mockResolvedValue(user);

    const result = await userService.getUserByEmail(email, relationsOptions);

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { email: email.toLowerCase() },
      relations: relationsOptions,
    });
    expect(result).toBeInstanceOf(ReturnUserDto);
    expect(result).toEqual(new ReturnUserDto(user));
  });

  it("getUserByEmail - Should throw an error if the user is not found", async () => {
    const email = MOCK_DATABASE_RETURNS.USER(MOCK_DEFAULTS.USER_ID).email;
    const relationsOptions = {};

    const user = null;

    userRepositoryMock.findOne.mockResolvedValue(user);

    await expect(
      userService.getUserByEmail(email, relationsOptions)
    ).rejects.toThrow(
      ERROR_MESSAGES.USER.USER_EMAIL_NOT_FOUND(email.toLowerCase())
    );
  });

  it("createUser - Should return ReturnUserDto on create user successfully", async () => {
    const createUserDto = MOCK_CREATES.USER;
    const userId = undefined;
    const userType = undefined;

    const passwordHashed = "passwordHashed";

    const savedUser = MOCK_DATABASE_CREATES.USER(
      createUserDto,
      MOCK_DEFAULTS.USER_ID,
      UserTypeEnum.User,
      passwordHashed
    );

    userService.getUserByEmail = jest
      .fn()
      .mockRejectedValue(
        new Error(
          ERROR_MESSAGES.USER.USER_EMAIL_NOT_FOUND(
            createUserDto.email.toLowerCase()
          )
        )
      );
    (createPasswordHashed as jest.Mock).mockResolvedValue(passwordHashed);
    userRepositoryMock.save.mockResolvedValue(savedUser);

    const result = await userService.createUser(
      createUserDto,
      userId,
      userType
    );

    expect(userService.getUserByEmail).toHaveBeenCalledWith(
      createUserDto.email
    );
    expect(createPasswordHashed).toHaveBeenCalledWith(createUserDto.password);
    expect(userRepositoryMock.save).toHaveBeenCalledWith({
      ...createUserDto,
      userType: UserTypeEnum.User,
      password: passwordHashed,
    });

    expect(
      userService["getCategoryService"]().createDefaultCategories
    ).toHaveBeenCalledWith(savedUser.id);

    expect(result).toBeInstanceOf(ReturnUserDto);
    expect(result).toEqual(new ReturnUserDto(savedUser));
  });

  it("createUser - Should return ReturnUserDto on create admin successfully", async () => {
    const createUserDto = MOCK_CREATES.USER;
    const userId = MOCK_DEFAULTS.USER_ID;
    const userType = UserTypeEnum.Root;

    const passwordHashed = "passwordHashed";

    const userRoot = MOCK_DATABASE_RETURNS.ROOT(userId);

    const savedUser = MOCK_DATABASE_CREATES.USER(
      createUserDto,
      MOCK_DEFAULTS.USER_ID,
      UserTypeEnum.User,
      passwordHashed
    );

    userService.getUserByEmail = jest
      .fn()
      .mockRejectedValue(
        new Error(
          ERROR_MESSAGES.USER.USER_EMAIL_NOT_FOUND(
            createUserDto.email.toLowerCase()
          )
        )
      );
    (createPasswordHashed as jest.Mock).mockResolvedValue(passwordHashed);
    userRepositoryMock.findOne.mockResolvedValue(userRoot);
    userRepositoryMock.save.mockResolvedValue(savedUser);

    const result = await userService.createUser(
      createUserDto,
      userId,
      userType
    );

    expect(userService.getUserByEmail).toHaveBeenCalledWith(
      createUserDto.email
    );
    expect(createPasswordHashed).toHaveBeenCalledWith(createUserDto.password);
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: userId, userType: userType },
    });
    expect(userRepositoryMock.save).toHaveBeenCalledWith({
      ...createUserDto,
      userType: UserTypeEnum.Admin,
      password: passwordHashed,
    });

    expect(
      userService["getCategoryService"]().createDefaultCategories
    ).not.toHaveBeenCalled();

    expect(result).toBeInstanceOf(ReturnUserDto);
    expect(result).toEqual(new ReturnUserDto(savedUser));
  });

  it("createUser - Should throw an error if the email already exists", async () => {
    const createUserDto = MOCK_CREATES.USER;
    const userId = undefined;
    const userType = undefined;

    const existingUser = MOCK_DATABASE_RETURNS.USER(MOCK_DEFAULTS.USER_ID);

    userService.getUserByEmail = jest.fn().mockResolvedValue(existingUser);

    await expect(
      userService.createUser(createUserDto, userId, userType)
    ).rejects.toThrow(ERROR_MESSAGES.USER.EMAIL_ALREADY_EXISTS);
  });

  it("createUser - Should throw an error if the passwords dont match", async () => {
    const createUserDto = {
      ...MOCK_CREATES.USER,
      confirmPassword: "differentPassword",
    };
    const userId = undefined;
    const userType = undefined;

    const existingUser = undefined;

    userService.getUserByEmail = jest.fn().mockResolvedValue(existingUser);

    await expect(
      userService.createUser(createUserDto, userId, userType)
    ).rejects.toThrow(ERROR_MESSAGES.USER.PASSWORDS_DO_NOT_MATCH);
  });

  it("createUser - Should throw an error if the root not found", async () => {
    const createUserDto = MOCK_CREATES.USER;
    const userId = MOCK_DEFAULTS.USER_ID;
    const userType = UserTypeEnum.Root;

    const passwordHashed = "passwordHashed";

    const userRoot = null;

    const existingUser = undefined;

    userService.getUserByEmail = jest.fn().mockResolvedValue(existingUser);
    (createPasswordHashed as jest.Mock).mockResolvedValue(passwordHashed);
    userRepositoryMock.findOne.mockResolvedValue(userRoot);

    await expect(
      userService.createUser(createUserDto, userId, userType)
    ).rejects.toThrow(ERROR_MESSAGES.USER.USER_ROOT_ID_NOT_FOUND(userId));
  });

  it("updateUser - Should return ReturnUserDto on update user successfully", async () => {
    const updateUserDto = MOCK_UPDATES.USER;
    const userId = MOCK_DEFAULTS.USER_ID;

    const user = MOCK_DATABASE_RETURNS.USER(userId);

    const newPasswordHashed = "newPasswordHashed";

    const updatedUser: ReturnUserDto & UserEntity = {
      ...user,
      ...updateUserDto,
      createdAt: MOCK_DEFAULTS.DATE,
      updatedAt: MOCK_DEFAULTS.DATE,
      tasks: undefined,
      categories: undefined,
    };

    userRepositoryMock.findOne.mockResolvedValue(user);
    (createPasswordHashed as jest.Mock).mockResolvedValue(newPasswordHashed);
    (validatePassword as jest.Mock).mockResolvedValue(true);
    userRepositoryMock.save.mockResolvedValue(updatedUser);

    const result = await userService.updateUser(userId, updateUserDto);

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect(createPasswordHashed).toHaveBeenCalledWith(
      updateUserDto.newPassword
    );
    expect(validatePassword).toHaveBeenCalledWith(
      updateUserDto.password,
      user.password
    );
    expect(userRepositoryMock.save).toHaveBeenCalledWith({
      ...user,
      ...updateUserDto,
      password: newPasswordHashed ? newPasswordHashed : user.password,
    });

    expect(result).toBeInstanceOf(ReturnUserDto);
    expect(result).toEqual(new ReturnUserDto(updatedUser));
  });

  it("updateUser - Should return ReturnUserDto on update user successfully (new email)", async () => {
    const updateUserDto = { ...MOCK_UPDATES.USER, email: "new@email.com" };
    const userId = MOCK_DEFAULTS.USER_ID;

    const user = MOCK_DATABASE_RETURNS.USER(userId);

    const newPasswordHashed = "newPasswordHashed";

    const updatedUser: ReturnUserDto & UserEntity = {
      ...user,
      ...updateUserDto,
      createdAt: MOCK_DEFAULTS.DATE,
      updatedAt: MOCK_DEFAULTS.DATE,
      tasks: undefined,
      categories: undefined,
    };

    userRepositoryMock.findOne.mockResolvedValue(user);
    userService.getUserByEmail = jest
      .fn()
      .mockRejectedValue(
        new Error(
          ERROR_MESSAGES.USER.USER_EMAIL_NOT_FOUND(
            updateUserDto.email.toLowerCase()
          )
        )
      );
    (createPasswordHashed as jest.Mock).mockResolvedValue(newPasswordHashed);
    (validatePassword as jest.Mock).mockResolvedValue(true);
    userRepositoryMock.save.mockResolvedValue(updatedUser);

    const result = await userService.updateUser(userId, updateUserDto);

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect(userService.getUserByEmail).toHaveBeenCalledWith(
      updateUserDto.email
    );
    expect(createPasswordHashed).toHaveBeenCalledWith(
      updateUserDto.newPassword
    );
    expect(validatePassword).toHaveBeenCalledWith(
      updateUserDto.password,
      user.password
    );
    expect(userRepositoryMock.save).toHaveBeenCalledWith({
      ...user,
      ...updateUserDto,
      password: newPasswordHashed ? newPasswordHashed : user.password,
    });

    expect(result).toBeInstanceOf(ReturnUserDto);
    expect(result).toEqual(new ReturnUserDto(updatedUser));
  });

  it("updateUser - Should return ReturnUserDto on update user successfully (password not changed)", async () => {
    const updateUserDto = {
      ...MOCK_UPDATES.USER,
      newPassword: undefined,
      confirmNewPassword: undefined,
    };
    const userId = MOCK_DEFAULTS.USER_ID;

    const user = MOCK_DATABASE_RETURNS.USER(userId);

    const newPasswordHashed = undefined;

    const updatedUser: ReturnUserDto & UserEntity = {
      ...user,
      ...updateUserDto,
      createdAt: MOCK_DEFAULTS.DATE,
      updatedAt: MOCK_DEFAULTS.DATE,
      tasks: undefined,
      categories: undefined,
    };

    userRepositoryMock.findOne.mockResolvedValue(user);
    (createPasswordHashed as jest.Mock).mockResolvedValue(newPasswordHashed);
    (validatePassword as jest.Mock).mockResolvedValue(true);
    userRepositoryMock.save.mockResolvedValue(updatedUser);

    const result = await userService.updateUser(userId, updateUserDto);

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect(createPasswordHashed).not.toHaveBeenCalled();
    expect(validatePassword).toHaveBeenCalledWith(
      updateUserDto.password,
      user.password
    );
    expect(userRepositoryMock.save).toHaveBeenCalledWith({
      ...user,
      ...updateUserDto,
      password: newPasswordHashed ? newPasswordHashed : user.password,
    });

    expect(result).toBeInstanceOf(ReturnUserDto);
    expect(result).toEqual(new ReturnUserDto(updatedUser));
  });

  it("updateUser - Should throw an error if the user not found", async () => {
    const updateUserDto = MOCK_UPDATES.USER;
    const userId = MOCK_DEFAULTS.USER_ID;

    const user = null;

    userRepositoryMock.findOne.mockResolvedValue(user);

    await expect(userService.updateUser(userId, updateUserDto)).rejects.toThrow(
      ERROR_MESSAGES.USER.USER_ID_NOT_FOUND(userId)
    );
  });

  it("updateUser - Should throw an error if the email already exists", async () => {
    const updateUserDto = {
      ...MOCK_UPDATES.USER,
      email: "existing@email.com",
    };
    const userId = MOCK_DEFAULTS.USER_ID;

    const user = MOCK_DATABASE_RETURNS.USER(userId);

    const existingUser = MOCK_DATABASE_RETURNS.USER(MOCK_DEFAULTS.USER_ID);

    userRepositoryMock.findOne.mockResolvedValue(user);
    userService.getUserByEmail = jest.fn().mockResolvedValue(existingUser);

    await expect(userService.updateUser(userId, updateUserDto)).rejects.toThrow(
      ERROR_MESSAGES.USER.EMAIL_ALREADY_EXISTS
    );
  });

  it("updateUser - Should throw an error if the passwords dont match", async () => {
    const updateUserDto = {
      ...MOCK_UPDATES.USER,
      confirmNewPassword: "differentPassword",
    };
    const userId = MOCK_DEFAULTS.USER_ID;

    const user = MOCK_DATABASE_RETURNS.USER(userId);

    userRepositoryMock.findOne.mockResolvedValue(user);

    await expect(userService.updateUser(userId, updateUserDto)).rejects.toThrow(
      ERROR_MESSAGES.USER.PASSWORDS_DO_NOT_MATCH
    );
  });

  it("updateUser - Should throw an error if the password is invalid", async () => {
    const updateUserDto = MOCK_UPDATES.USER;
    const userId = MOCK_DEFAULTS.USER_ID;

    const user = MOCK_DATABASE_RETURNS.USER(userId);

    userRepositoryMock.findOne.mockResolvedValue(user);
    (validatePassword as jest.Mock).mockResolvedValue(false);

    await expect(userService.updateUser(userId, updateUserDto)).rejects.toThrow(
      ERROR_MESSAGES.USER.INVALID_USER_PASSWORD
    );
  });

  it("deleteUserMy - Should return DeleteResult on delete my user successfully", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;
    const deleteUserDto = MOCK_DELETES.USER;

    const user = MOCK_DATABASE_RETURNS.USER(userId);

    userRepositoryMock.findOne.mockResolvedValue(user);
    (validatePassword as jest.Mock).mockResolvedValue(true);
    userRepositoryMock.delete.mockResolvedValue(MOCK_DELETE_RESULT);

    const result = await userService.deleteUserMy(userId, deleteUserDto);

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect(validatePassword).toHaveBeenCalledWith(
      deleteUserDto.password,
      user.password
    );
    expect(userRepositoryMock.delete).toHaveBeenCalledWith({
      id: userId,
    });
    expect(result).toEqual(MOCK_DELETE_RESULT);
  });

  it("deleteUserMy - Should throw an error if the user is not found", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;
    const deleteUserDto = MOCK_DELETES.USER;

    const user = null;

    userRepositoryMock.findOne.mockResolvedValue(user);

    await expect(
      userService.deleteUserMy(userId, deleteUserDto)
    ).rejects.toThrow(ERROR_MESSAGES.USER.USER_ID_NOT_FOUND(userId));
  });

  it("deleteUserMy - Should throw an error if the password is invalid", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;
    const deleteUserDto = MOCK_DELETES.USER;

    const user = MOCK_DATABASE_RETURNS.USER(userId);

    userRepositoryMock.findOne.mockResolvedValue(user);
    (validatePassword as jest.Mock).mockResolvedValue(false);

    await expect(
      userService.deleteUserMy(userId, deleteUserDto)
    ).rejects.toThrow(ERROR_MESSAGES.USER.INVALID_USER_PASSWORD);
  });

  it("deleteUser - Should return DeleteResult on delete user successfully", async () => {
    const userDeleteId = MOCK_DEFAULTS.USER_DELETE_ID;

    userService.getUserById = jest
      .fn()
      .mockResolvedValue(MOCK_RETURNS.USER(userDeleteId));
    userRepositoryMock.delete.mockResolvedValue(MOCK_DELETE_RESULT);

    const result = await userService.deleteUser(userDeleteId);

    expect(userService.getUserById).toHaveBeenCalledWith(userDeleteId);
    expect(userRepositoryMock.delete).toHaveBeenCalledWith({
      id: userDeleteId,
    });
    expect(result).toEqual(MOCK_DELETE_RESULT);
  });

  it("deleteAdmin - Should return DeleteResult on delete admin successfully", async () => {
    const adminDeleteId = MOCK_DEFAULTS.ADMIN_DELETE_ID;

    const user = MOCK_DATABASE_RETURNS.ADMIN(adminDeleteId);

    userRepositoryMock.findOne.mockResolvedValue(user);
    userRepositoryMock.delete.mockResolvedValue(MOCK_DELETE_RESULT);

    const result = await userService.deleteAdmin(adminDeleteId);

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: adminDeleteId, userType: UserTypeEnum.Admin },
    });
    expect(userRepositoryMock.delete).toHaveBeenCalledWith({
      id: adminDeleteId,
    });
    expect(result).toEqual(MOCK_DELETE_RESULT);
  });

  it("deleteAdmin - Should throw an error if the user is not found", async () => {
    const adminDeleteId = MOCK_DEFAULTS.ADMIN_DELETE_ID;

    const user = null;

    userRepositoryMock.findOne.mockResolvedValue(user);

    await expect(userService.deleteAdmin(adminDeleteId)).rejects.toThrow(
      ERROR_MESSAGES.USER.USER_ID_NOT_FOUND(adminDeleteId)
    );
  });
});
