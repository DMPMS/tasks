export const AUTHORIZATION_KEY = "AUTHORIZATION_KEY";

export const NOTIFICATION_TIMEOUT = 3000;

export const PAGINATION = {
  INITIAL_PAGE: 1,
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 5,
};

export const DATETIME_FORMAT = {
  SHOW: "dd/MM/yyyy 'às' HH:mm",
  REQUEST: "yyyy-MM-dd HH:mm",
  INPUT: "yyyy-MM-dd'T'HH:mm",
};

export const DEFAULT_NAME_FOR_COMPLETE_TASK = "taskStatus";

export const USER = {
  NAME_LENGTH: {
    MIN: 8,
    MAX: 30,
  },
  EMAIL_LENGTH: {
    MIN: 8,
    MAX: 100,
  },
  PASSWORD_LENGTH: {
    MIN: 8,
    MAX: 100,
  },
  CONFIRM_PASSWORD_LENGTH: {
    MIN: 1,
    MAX: 100,
  },
};

export const TASK = {
  TITLE_LENGTH: {
    MIN: 1,
    MAX: 60,
  },
};

export const CATEGORY = {
  NAME_LENGTH: {
    MIN: 1,
    MAX: 20,
  },
};
