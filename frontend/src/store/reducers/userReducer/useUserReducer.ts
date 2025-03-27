import { useDispatch } from "react-redux";

import { useAppSelector } from "../../hooks";
import { setUsersAction } from ".";
import { UserType } from "../../../types/UserType";

export const useUserReducer = () => {
  const dispatch = useDispatch();
  const { users } = useAppSelector((state) => state.userReducer);

  const setUsers = (users: UserType[]) => {
    dispatch(setUsersAction(users));
  };

  return {
    users,
    setUsers,
  };
};
