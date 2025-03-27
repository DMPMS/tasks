import { configureStore } from "@reduxjs/toolkit";

import globalReducer from "./reducers/globalReducer";
import taskReducer from "./reducers/taskReducer";
import categoryReducer from "./reducers/categoryReducer";
import userReducer from "./reducers/userReducer";

export const store = configureStore({
  reducer: {
    globalReducer,
    taskReducer,
    categoryReducer,
    userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
