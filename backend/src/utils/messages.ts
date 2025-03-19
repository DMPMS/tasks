export const ERROR_MESSAGES = {
  USER: {
    EMAIL_ALREADY_EXISTS: "User with this email already exists.",
    CREATE_USER_ERROR: "Error creating user.",
    LOGIN_USER_ERROR: "Error login user.",
    SELECT_USER_ERROR: "Error fetching users.",
    PASSWORDS_DO_NOT_MATCH: "Passwords do not match.",
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
