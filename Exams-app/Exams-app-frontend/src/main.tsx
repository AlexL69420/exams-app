import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import Profile from "./pages/Profile.tsx";
import { AuthForm } from "./pages/AuthForm.tsx";
import Help from "./pages/Help.tsx";
import Variant from "./pages/Variant.tsx";
import VariantsList from "./pages/Variants.tsx";
import ExercisesList from "./pages/Exercises.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/profile",
    element: <Profile />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/auth",
    element: <AuthForm />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/help",
    element: <Help />,
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
    element: <ExercisesList />,
    errorElement: <NotFoundPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
