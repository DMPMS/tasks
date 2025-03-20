export const ERROR_MESSAGES = {
  USER: {
    EMAIL_ALREADY_EXISTS: "User with this email already exists.",
    CREATE_USER_ERROR: "Error creating user.",
    LOGIN_USER_ERROR: "Error login user.",
    SELECT_USER_ERROR: "Error fetching users.",
    PASSWORDS_DO_NOT_MATCH: "Passwords do not match.",
    USER_ROOT_ID_NOT_FOUND: (userId: number) =>
      `User root with id ${userId} not found.`,
    USER_ID_NOT_FOUND: (userId: number) => `User with id ${userId} not found.`,
    USER_ID_IS_REQUIRED: "userId is required.",
    USER_TYPE_IS_REQUIRED: "userType is required.",
  },
  TASK: {
    CREATE_TASK_ERROR: "Error creating task.",
    SELECT_TASK_ERROR: "Error fetching tasks.",
    USER_ID_IS_REQUIRED: "userId is required.",
  },
  AUTH: {
    INVALID_CREDENTIALS: "Invalid email or password.",
    ACCESS_DENIED: "Access denied.",
  },
  ENV: {
    MISSING_JWT_SECRET: "JWT secret is missing or empty.",
    MISSING_ROOT_EMAIL_OR_PASSWORD:
      "ROOT_EMAIL or ROOT_PASSWORD not defined in .env file.",
    MISSING_ROOT_EMAIL: "ROOT_EMAIL not defined in .env file.",
  },
};

export const LOG_MESSAGES = {
  DATABASE_CONNECTED: "Database connected.",
  MIGRATIONS_EXECUTED: "Migrations executed.",
  SERVER_RUNNING: (port: number) => `Server is running on port ${port}.`,
  DATABASE_INITIALIZATION_ERROR: "Error during Data Source initialization:",
};
