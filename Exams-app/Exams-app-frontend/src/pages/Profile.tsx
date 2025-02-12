import { Link } from "react-router-dom";
import { Button, Label, TextInput } from "flowbite-react";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function Profile() {
  const { logout } = useAuth();
  const { userEmail, userPassword, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // запрос на смену пароля
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return (
    <main className="flex min-h-screen  justify-center bg-blue-500 py-8 text-black dark:bg-slate-700 dark:text-white">
      <div className="flex w-2/3 flex-col gap-2 rounded-2xl bg-white text-black dark:bg-slate-800 dark:text-white">
        <div className="flex h-20 w-11/12 flex-row items-center justify-end">
          <div className="flex w-5/6 justify-center">
            <h1 className="text-3xl">Профиль</h1>
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
        <div className="flex  h-max flex-col items-center justify-center gap-2">
          <div className="flex h-max w-2/3 flex-col  gap-2">
            <div className="flex h-28 flex-col items-center gap-2">
              <h1 className="font-bold">Текущий профиль</h1>
              <div className="rounded-2xl border-2 border-black p-5 dark:border-white">
                <h1>Логин: {userEmail}</h1>
                <h2>Пароль: {userPassword}</h2>
              </div>
            </div>
            <h1 className="font-bold">Изменение профиля</h1>
            <form className="flex flex-col items-center gap-2 rounded-2xl border-2 border-black p-5 dark:border-white ">
              <div className="w-1/2">
                <div className="mb-2 block">
                  <Label htmlFor="email1" value="Введите логин" />
                </div>
                <TextInput
                  id="email1"
                  type=""
                  placeholder="doctor@gmail.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="w-1/2">
                <div className="mb-2 block">
                  <Label htmlFor="password1" value="Введите новый пароль" />
                </div>
                <TextInput
                  id="password1"
                  type="password"
                  placeholder="123456789"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Link to="/">
                <Button
                  color="blue"
                  className="dark:bg-slate-900 dark:hover:bg-slate-700"
                  onClick={handleSubmit}
                >
                  Изменить профиль
                </Button>
              </Link>
            </form>
          </div>
          <div className="flex w-11/12 justify-end px-10">
            <Button
              color="failure"
              className="flex size-12 items-center justify-around border-2 border-black bg-red-600 text-black  dark:border-white dark:bg-red-800 dark:text-white  dark:hover:bg-red-700"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
