import { configureStore } from "@reduxjs/toolkit";

import globalReducer from "./reducers/globalReducer";
import taskReducer from "./reducers/taskReducer";

export const store = configureStore({
  reducer: {
    globalReducer,
    taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
