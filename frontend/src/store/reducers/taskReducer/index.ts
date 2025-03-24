import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskType } from "../../../types/TaskType";

interface TaskState {
  tasks: TaskType[];
  task?: TaskType;
}

const initialState: TaskState = {
  tasks: [],
  task: undefined,
};

export const counterSlice = createSlice({
  name: "taskReducer",
  initialState,
  reducers: {
    setTasksAction: (state, action: PayloadAction<TaskType[]>) => {
      state.tasks = action.payload;
    },
    setTaskAction: (state, action: PayloadAction<TaskType | undefined>) => {
      state.task = action.payload;
    },
  },
});

export const { setTasksAction, setTaskAction } = counterSlice.actions;

export default counterSlice.reducer;
