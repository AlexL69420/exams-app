import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import ProfilePage from "./pages/Profile.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import Variant from "./pages/Variant.tsx";
import VariantsList from "./pages/Variants.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import Courses from "./pages/Courses.tsx";
import Constructor from "./pages/Constructor.tsx";
import ExercisesPage from "./pages/ExercisesPage.tsx";
import RegisterForm from "./pages/RegisterPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/auth",
    element: <LoginPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/variant/:id",
    element: <Variant />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/variants",
    element: <VariantsList />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/exercises",
    element: <ExercisesPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/notfound",
    element: <NotFoundPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/adminpage",
    element: <AdminPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/courses",
    element: <Courses />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/constructor",
    element: <Constructor />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/register",
    element: <RegisterForm />,
    errorElement: <NotFoundPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
    ,
  </AuthProvider>,
);
