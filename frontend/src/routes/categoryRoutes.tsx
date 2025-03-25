import { RouteObject } from "react-router-dom";
import CreateCategoryScreen from "../screens/createCategoryScreen";
import CategoriesScreen from "../screens/categoriesScreen";

export enum CategoryRoutesEnum {
  Categories = "/category",
  CreateCategory = "/category/create",
  UpdateCategory = "/category/:categoryId",
}

export const categoryRoutes: RouteObject[] = [
  {
    path: CategoryRoutesEnum.Categories,
    element: <CategoriesScreen />,
  },
  {
    path: CategoryRoutesEnum.CreateCategory,
    element: <CreateCategoryScreen />,
  },
  {
    path: CategoryRoutesEnum.UpdateCategory,
    element: <CreateCategoryScreen />,
  },
];
