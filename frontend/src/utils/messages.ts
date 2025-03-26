export const ERROR_MESSAGES = {
  DEFAULT: "Erro.",
};

export const SUCCESS_MESSAGES = {
  TASK: {
    TASK_CREATED_SUCCESSFULLY: "Tarefa criada.",
    TASK_UPDATE_SUCCESSFULLY: "Tarefa editada.",
    TASK_DELETED_SUCCESSFULLY: "Tarefa deletada.",
  },
  CATEGORY: {
    CATEGORY_CREATED_SUCCESSFULLY: "Categoria criada.",
    CATEGORY_UPDATE_SUCCESSFULLY: "Categoria editada.",
    CATEGORY_DELETED_SUCCESSFULLY: "Categoria deletada.",
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
