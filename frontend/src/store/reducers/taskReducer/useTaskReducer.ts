import { useDispatch } from "react-redux";

import { useAppSelector } from "../../hooks";
import { setTaskAction, setTasksAction } from ".";
import { TaskType } from "../../../types/TaskType";

export const useTaskReducer = () => {
  const dispatch = useDispatch();
  const { tasks, task } = useAppSelector((state) => state.taskReducer);

  const setTasks = (tasks: TaskType[]) => {
    dispatch(setTasksAction(tasks));
  };

  const setTask = (task?: TaskType) => {
    dispatch(setTaskAction(task));
  };

  return {
    tasks,
    task,
    setTasks,
    setTask,
  };
};
