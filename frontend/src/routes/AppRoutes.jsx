import { RouterProvider, createBrowserRouter } from "react-router";
import LoginPage from "../components/LoginPage";
import RegisterPage from "../components/RegisterPage";
import MainLayout from "../layout/MainLayout";
import HomePage from "../components/HomePage";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import AuthLayout from "../layout/AuthLayout";
import AboutPage from "../components/AboutPage";
import ProductPage from "../components/ProductPage";

const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path:"/",
      element: <PublicRoute />,
      children: [
        {
          path: "",
          element: <AuthLayout />,
          children: [
            {
              path: "",
              element: <LoginPage />,
            },
            {
              path: "/register",
              element: <RegisterPage />,
            },
          ],
        },
      ],
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/main",
          element: <MainLayout />,
          children: [
            {
              path: "",
              element: <HomePage />,
            },
            {
              path: "about",
              element: <AboutPage />,
            },
            {
              path: "product",
              element: <ProductPage />,
            },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};
export default AppRoutes;
