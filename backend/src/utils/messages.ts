export const ERROR_MESSAGES = {
  USER: {
    EMAIL_ALREADY_EXISTS: "Já existe um usuário com esse e-mail.",
    CREATE_USER_ERROR: "Erro ao criar usuário.",
    SELECT_USER_ERROR: "Erro ao buscar usuários.",
    PASSWORDS_DO_NOT_MATCH: "As senhas não coincidem.",
    USER_ROOT_ID_NOT_FOUND: (userId: number) =>
      `O usuário root com id ${userId} não foi encontrado.`,
    USER_ID_NOT_FOUND: (userId: number) =>
      `O usuário com id ${userId} não foi encontrado.`,
    USER_ID_IS_REQUIRED: "O userId é obrigatório.",
    USER_TYPE_IS_REQUIRED: "O userType é obrigatório.",
  },
  TASK: {
    CREATE_TASK_ERROR: "Erro ao criar tarefa.",
    UPDATE_TASK_ERROR: "Erro ao editar tarefa.",
    SELECT_TASK_ERROR: "Erro ao buscar tarefas.",
    SELECT_TASK_BY_ID_ERROR: "Erro ao buscar tarefa.",
    DELETE_TASK_ERROR: "Erro ao deletar tarefa.",
    INVALID_TASK_ID: "taskId inválido.",
    USER_ID_IS_REQUIRED: "O userId é obrigatório.",
    TASK_ID_IS_REQUIRED: "O taskId é obrigatório.",
    TASK_ID_NOT_FOUND: (taskId: number, userId: number) =>
      `A tarefa com id ${taskId} não foi encontrada para o userId ${userId}.`,
  },
  CATEGORY: {
    CREATE_CATEGORY_ERROR: "Erro ao criar categoria.",
    SELECT_CATEGORY_ERROR: "Erro ao buscar categorias.",
    DELETE_CATEGORY_ERROR: "Erro ao deletar categoria.",
    INVALID_CATEGORY_ID: "categoryId inválido.",
    USER_ID_IS_REQUIRED: "O userId é obrigatório.",
    CATEGORY_ID_IS_REQUIRED: "O categoryId é obrigatório.",
    CATEGORY_ALREADY_EXISTS: "Já existe uma categoria com esse nome.",
    CATEGORY_ID_NOT_FOUND: (categoryId: number, userId: number) =>
      `A categoria com id ${categoryId} não foi encontrada para o userId ${userId}.`,
  },
  AUTH: {
    INVALID_CREDENTIALS: "E-mail ou senha inválidos.",
    ACCESS_DENIED: "Acesso negado.",
  },
  ENV: {
    MISSING_JWT_SECRET: "O JWT secret está ausente ou vazio.",
    MISSING_ROOT_EMAIL_OR_PASSWORD:
      "ROOT_EMAIL ou ROOT_PASSWORD não definidos no arquivo .env.",
    MISSING_ROOT_EMAIL: "ROOT_EMAIL não definido no arquivo .env.",
  },
};

export const SUCCESS_MESSAGES = {
  CATEGORY: {
    CATEGORY_DELETED_SUCCESSFULLY: "Categoria deletada.",
  },
  TASK: {
    TASK_DELETED_SUCCESSFULLY: "Tarefa deletada.",
  },
};

export const LOG_MESSAGES = {
  DATABASE_CONNECTED: "Database connected.",
  MIGRATIONS_EXECUTED: "Migrations executed.",
  SERVER_RUNNING: (port: number) => `Server is running on port ${port}.`,
  DATABASE_INITIALIZATION_ERROR: "Error during Data Source initialization:",
};
