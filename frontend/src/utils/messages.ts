export const ERROR_MESSAGES = {
  DEFAULT: "Erro.",
  TOKEN_USER_TYPE_ROOT: "E-mail ou senha inválidos.",
};

export const SUCCESS_MESSAGES = {
  USER: {
    USER_DELETED_SUCCESSFULLY: "Usuário deletado.",
    USER_UPDATED_SUCCESSFULLY: "Usuário editado.",
    USER_MY_DELETED_SUCCESSFULLY:
      "Usuário deletado. Volte sempre que quiser 🥹.",
  },
  TASK: {
    TASK_CREATED_SUCCESSFULLY: "Tarefa criada.",
    TASK_UPDATED_SUCCESSFULLY: "Tarefa editada.",
    TASK_DELETED_SUCCESSFULLY: "Tarefa deletada.",
  },
  CATEGORY: {
    CATEGORY_CREATED_SUCCESSFULLY: "Categoria criada.",
    CATEGORY_UPDATED_SUCCESSFULLY: "Categoria editada.",
    CATEGORY_DELETED_SUCCESSFULLY: "Categoria deletada.",
  },
  WELCOME: {
    SIGN_IN: (name: string) => `Bem-vindo(a) de volta, ${name} 😊!`,
    SIGN_UP: (name: string) => `Bem-vindo(a), ${name} 😊!`,
  },
};

export const FIELD_VALIDATION_MESSAGES = {
  NOT_FOUND: (name: string) => `O campo '${name}' não foi encontrado.`,
  REQUIRED: "Preencha este campo.",
  SIGN_IN: {
    EMAIL_INVALID: "Insira um e-mail válido.",
  },
  USER: {
    NAME: {
      MIN_CHARACTER: (min: number) => `Insira pelo menos ${min} caractere(s).`,
      MAX_CHARACTER: (max: number) => `Insira até ${max} caractere(s).`,
    },
    EMAIL: {
      EMAIL_INVALID: "Insira um e-mail válido.",
      MIN_CHARACTER: (min: number) => `Insira pelo menos ${min} caractere(s).`,
      MAX_CHARACTER: (max: number) => `Insira até ${max} caractere(s).`,
    },
    PASSWORD: {
      MIN_CHARACTER: (min: number) => `Insira pelo menos ${min} caractere(s).`,
      MAX_CHARACTER: (max: number) => `Insira até ${max} caractere(s).`,
    },
    CONFIRM_PASSWORD: {
      MIN_CHARACTER: (min: number) => `Insira pelo menos ${min} caractere(s).`,
      MAX_CHARACTER: (max: number) => `Insira até ${max} caractere(s).`,
      PASSWORDS_DO_NOT_MATCH: "As senhas não coincidem.",
    },
  },
  TASK: {
    TITLE: {
      MIN_CHARACTER: (min: number) => `Insira pelo menos ${min} caractere(s).`,
      MAX_CHARACTER: (max: number) => `Insira até ${max} caractere(s).`,
    },
    LIMIT_DATE: {
      PAST_DATE: "A data limite é anterior a data atual.",
    },
  },
  CATEGORY: {
    NAME: {
      MIN_CHARACTER: (min: number) => `Insira pelo menos ${min} caractere(s).`,
      MAX_CHARACTER: (max: number) => `Insira até ${max} caractere(s).`,
      CATEGORY_ALREADY_EXISTS: "Já existe uma categoria com esse nome.",
    },
  },
};
