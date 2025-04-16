export const ERROR_MESSAGES = {
  USER: {
    EMAIL_ALREADY_EXISTS: "E-mail já cadastrado.",
    CREATE_USER_ERROR: "Erro ao criar usuário.",
    UPDATE_USER_ERROR: "Erro ao editar usuário.",
    SELECT_USER_ERROR: "Erro ao buscar usuários.",
    SELECT_USER_INFO_ERROR: "Erro ao buscar informações do usuário.",
    PASSWORDS_DO_NOT_MATCH: "As senhas não coincidem.",
    USER_ROOT_ID_NOT_FOUND: (userId: number) =>
      `O usuário root com id ${userId} não foi encontrado.`,
    USER_ID_NOT_FOUND: (userId: number) =>
      `O usuário com id ${userId} não foi encontrado.`,
    USER_EMAIL_NOT_FOUND: (userEmail: string) =>
      `O usuário com e-mail ${userEmail} não foi encontrado.`,
    DELETE_USER_ERROR: "Erro ao deletar usuário.",
    DELETE_ADMIN_ERROR: "Erro ao deletar administrador.",
    DELETE_USER_MY_ERROR: "Erro ao deletar seu usuário.",
    INVALID_USER_DELETE_ID: "userDeleteId inválido.",
    INVALID_ADMIN_DELETE_ID: "adminDeleteId inválido.",
    INVALID_USER_PASSWORD: "Senha atual incorreta.",
    USER_ID_IS_REQUIRED: "O userId é obrigatório.",
    USER_DELETE_ID_IS_REQUIRED: "O userDeleteId é obrigatório.",
    ADMIN_DELETE_ID_IS_REQUIRED: "O adminDeleteId é obrigatório.",
    USER_TYPE_IS_REQUIRED: "O userType é obrigatório.",
  },
  TASK: {
    CREATE_TASK_ERROR: "Erro ao criar tarefa.",
    UPDATE_TASK_ERROR: "Erro ao editar tarefa.",
    UPDATE_TASK_COMPLETED_DATE_ERROR: "Erro ao alterar status da tarefa.",
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
    UPDATE_CATEGORY_ERROR: "Erro ao editar categoria.",
    SELECT_CATEGORY_ERROR: "Erro ao buscar categorias.",
    SELECT_CATEGORY_BY_ID_ERROR: "Erro ao buscar categoria.",
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
    MISSING_FIRST_ADMIN_EMAIL_OR_PASSWORD:
      "FIRST_ADMIN_EMAIL ou FIRST_ADMIN_PASSWORD não definidos no arquivo .env.",
    MISSING_FIRST_ADMIN_EMAIL:
      "FIRST_ADMIN_EMAIL não definido no arquivo .env.",
  },
  DTO: {
    INVALID_DATA:
      "Os dados fornecidos são inválidos. Verifique e tente novamente.",
  },
};

export const SUCCESS_MESSAGES = {
  USER: {
    USER_DELETED_SUCCESSFULLY: "Usuário deletado.",
    ADMIN_DELETED_SUCCESSFULLY: "Administrador deletado.",
    USER_MY_DELETED_SUCCESSFULLY:
      "Usuário deletado. Volte sempre que quiser 🥹.",
  },
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
