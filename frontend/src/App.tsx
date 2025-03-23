import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import { signInRoutes } from "./routes/signInRoutes";
import { signUpRoutes } from "./routes/signUpRoutes";
import { authRedirectRoutes } from "./routes/authRedirectRoutes";
import { verifyLoggedIn } from "./utils/functions/auth";
import { UserTypeEnum } from "./enums/UserTypeEnum";
import { taskRoutes } from "./routes/taskRoutes";
import { userRoutes } from "./routes/userRoutes";
import Notification from "./components/notification/notification";
import NotFoundScreen from "./screens/notFoundScreen";

const routesNotLoggedIn: RouteObject[] = [...signInRoutes, ...signUpRoutes];

const routesLoggedIn: RouteObject[] = [...authRedirectRoutes].map((route) => ({
  ...route,
  loader: verifyLoggedIn(),
}));

const routesAdminLoggedIn: RouteObject[] = [...userRoutes].map((route) => ({
  ...route,
  loader: verifyLoggedIn(UserTypeEnum.Admin),
}));

const routesUserLoggedIn: RouteObject[] = [...taskRoutes].map((route) => ({
  ...route,
  loader: verifyLoggedIn(UserTypeEnum.User),
}));

const router = createBrowserRouter([
  ...routesNotLoggedIn,
  ...routesLoggedIn,
  ...routesAdminLoggedIn,
  ...routesUserLoggedIn,
  {
    path: "*",
    element: <NotFoundScreen />,
  },
]);

function App() {
  const { showNotification } = Notification();

  return (
    <>
      {showNotification}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
