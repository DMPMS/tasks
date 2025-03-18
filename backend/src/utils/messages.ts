export const ERROR_MESSAGES = {
  EMAIL_ALREADY_EXISTS: "User with this email already exists.",
  CREATE_USER_ERROR: "Error creating user.",
  SELECT_USER_ERROR: "Error fetching users.",
};

export const LOG_MESSAGES = {
  DATABASE_CONNECTED: "Database connected.",
  MIGRATIONS_EXECUTED: "Migrations executed.",
  SERVER_RUNNING: (port: number) => `Server is running on port ${port}.`,
  DATABASE_INITIALIZATION_ERROR: "Error during Data Source initialization:",
};
