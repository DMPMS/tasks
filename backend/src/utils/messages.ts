export const ERROR_MESSAGES = {
  USER: {
    EMAIL_ALREADY_EXISTS: "User with this email already exists.",
    CREATE_USER_ERROR: "Error creating user.",
    LOGIN_USER_ERROR: "Error login user.",
    SELECT_USER_ERROR: "Error fetching users.",
    PASSWORDS_DO_NOT_MATCH: "Passwords do not match.",
    USER_ID_NOT_FOUND: (userId: number) => `User with id ${userId} not found.`,
  },
  TASK: {
    CREATE_TASK_ERROR: "Error creating task.",
    SELECT_TASK_ERROR: "Error fetching tasks.",
    USER_ID_IS_REQUIRED: "userId is required.",
  },
  AUTH: {
    INVALID_CREDENTIALS: "Invalid email or password.",
    MISSING_JWT_SECRET: "JWT secret is missing or empty.",
  },
};

export const LOG_MESSAGES = {
  DATABASE_CONNECTED: "Database connected.",
  MIGRATIONS_EXECUTED: "Migrations executed.",
  SERVER_RUNNING: (port: number) => `Server is running on port ${port}.`,
  DATABASE_INITIALIZATION_ERROR: "Error during Data Source initialization:",
};
