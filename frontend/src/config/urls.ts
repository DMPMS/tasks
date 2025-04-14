const BACKEND_API_PORT = import.meta.env.VITE_BACKEND_API_PORT;

export const URL_AUTH = `http://localhost:${BACKEND_API_PORT}/api/auth`;

export const URL_USER = `http://localhost:${BACKEND_API_PORT}/api/user`;
export const URL_USER_UPDATE = `http://localhost:${BACKEND_API_PORT}/api/user/update`;
export const URL_USER_ID = `http://localhost:${BACKEND_API_PORT}/api/user/:userId`;

export const URL_TASK = `http://localhost:${BACKEND_API_PORT}/api/task`;
export const URL_TASK_ID = `http://localhost:${BACKEND_API_PORT}/api/task/:taskId`;
export const URL_TASK_ID_STATUS = `http://localhost:${BACKEND_API_PORT}/api/task/:taskId/completedDate`;

export const URL_CATEGORY = `http://localhost:${BACKEND_API_PORT}/api/category`;
export const URL_CATEGORY_ID = `http://localhost:${BACKEND_API_PORT}/api/category/:categoryId`;
