import { useDispatch } from "react-redux";

import { useAppSelector } from "../../hooks";
import { setCategoriesAction, setCategoryAction } from ".";
import { CategoryType } from "../../../types/CategoryType";

export const useCategoryReducer = () => {
  const dispatch = useDispatch();
  const { categories, category } = useAppSelector(
    (state) => state.categoryReducer
  );

  const setCategories = (categories: CategoryType[]) => {
    dispatch(setCategoriesAction(categories));
  };

  const setCategory = (category?: CategoryType) => {
    dispatch(setCategoryAction(category));
  };

  return {
    categories,
    category,
    setCategories,
    setCategory,
  };
};
