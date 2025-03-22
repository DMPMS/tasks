import { configureStore } from "@reduxjs/toolkit";

import globalReducer from "./reducers/globalReducer";

export const store = configureStore({
  reducer: {
    globalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
