import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "../../../types/UserType";
import { NotificationType } from "../../../types/NotificationType";

interface GlobalState {
  user?: UserType;
  notification?: NotificationType;
}

const initialState: GlobalState = {
  user: undefined,
  notification: undefined,
};

export const counterSlice = createSlice({
  name: "globalReducer",
  initialState,
  reducers: {
    setUserAction: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    setNotificationAction: (state, action: PayloadAction<NotificationType>) => {
      state.notification = action.payload;
    },
  },
});

export const { setUserAction, setNotificationAction } = counterSlice.actions;

export default counterSlice.reducer;
