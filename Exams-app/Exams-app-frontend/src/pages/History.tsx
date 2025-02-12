import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaSearch } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

export default function History() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return (
    <main className="flex min-h-screen flex-col gap-2 bg-white text-black dark:bg-slate-800 dark:text-white">
      <div className="flex h-20 w-11/12 flex-row items-center justify-end">
        <div className="flex w-5/6 justify-center">
          <h1 className="text-3xl">История диагнозов</h1>
        </div>
        <div className="flex w-1/6 justify-end">
          <Link to="/">
            <Button
              color="light"
              className="flex size-12 items-center justify-around rounded-full border-2 border-black bg-white text-black hover:bg-slate-300 disabled:pointer-events-none  dark:border-white dark:bg-slate-800 dark:text-white  dark:hover:bg-slate-700"
            >
              X
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex  flex-col justify-around gap-3 p-5 px-20">
        <p> Вы не зарегистрированы</p>
        <div className="flex  flex-row gap-1">
          <p> Чтобы смотреть историю своих диагнозов, </p>
          <Link to="/Registration" className="underline">
            зарегистрируйтесь
          </Link>
        </div>
      </div>
    </main>
  );
}
