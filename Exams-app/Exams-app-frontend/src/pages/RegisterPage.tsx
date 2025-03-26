import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { LOCAL_API_URL } from "../enviroment";
import { useAuth } from "../contexts/AuthContext";
import { Button, Avatar } from "flowbite-react";
import { VscAccount } from "react-icons/vsc";
import { ImageInput } from "../components/ImageInput";

export default function RegisterForm() {
  // Состояние для обработки ошибок
  const [error, setError] = useState<string | null>(null);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayedName, setDisplayedName] = useState<string>("");
  const [userIcon, setUserIcon] = useState<string>("");
  const [userDescription, setUserDescription] = useState<string>("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${LOCAL_API_URL}api/users/register`,
        {
          username,
          password,
          displayedName,
          userIcon,
          userDescription,
        },
        { withCredentials: true },
      );

      console.log("Успешный вход:", response.data);
      login(response.data.user);
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Обработка ошибок, возвращаемых сервером
        if (err.response) {
          const errorMessage =
            err.response.data.error || "Ошибка при создании пользователя";
          setError(errorMessage);
        } else if (err.request) {
          setError("Ошибка сети. Проверьте подключение к интернету.");
        } else {
          setError("Произошла ошибка при отправке запроса.");
        }
      } else {
        setError("Неизвестная ошибка");
      }
    }
  };

  const handleImageChange = async (url: string) => {
    setUserIcon(url);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100 dark:bg-slate-500">
      <div className="flex w-full max-w-screen-lg flex-col items-center gap-4 rounded-lg bg-white p-8 shadow-md dark:bg-slate-700 dark:text-slate-200">
        <div className="flex w-full justify-end">
          <Link to="/">
            <Button
              color="light"
              className="flex size-10 items-center justify-center rounded-full border-2 border-black bg-white text-black hover:bg-slate-300 disabled:pointer-events-none  dark:border-white dark:bg-slate-800 dark:text-white  dark:hover:bg-slate-700"
            >
              X
            </Button>
          </Link>
        </div>
        <h1 className="mb-6 text-center text-2xl font-bold">
          Регистрация аккаунта
        </h1>
        <div className="flex min-w-96 flex-row gap-4 rounded border-2 border-slate-600 p-2 dark:border-slate-300">
          {userIcon === "" ? (
            <Avatar
              img={VscAccount}
              className="size-36 rounded-full border-2 border-white object-cover dark:border-slate-500"
              rounded
            />
          ) : (
            <img
              src={userIcon}
              alt={displayedName} // Используем первую букву имени как альтернативный текст
              className="size-36 rounded-full border-2 border-white object-cover dark:border-slate-500"
            />
          )}

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">{displayedName}</h2>
            <h2 className="w-5/6 min-w-12 border-2 border-white bg-zinc-300 p-2 dark:border-slate-500 dark:bg-slate-800">
              {userDescription}
            </h2>
          </div>
        </div>
        {error && <p className="mb-4 text-xl text-red-500">{error}</p>}
        <form
          onSubmit={handleRegister}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex flex-row flex-wrap gap-4">
            {" "}
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Отображаемое имя"
                value={displayedName}
                onChange={(e) => setDisplayedName(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-600 "
              />

              <textarea
                placeholder="Описание"
                value={userDescription}
                onChange={(e) => setUserDescription(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-600 "
              />
            </div>
            <div className="w-72">
              <ImageInput onImageChange={handleImageChange} />
            </div>
          </div>
          <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full max-w-lg rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-600"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full max-w-lg rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-600"
          />

          <button
            type="submit"
            className="w-full max-w-lg rounded-lg bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600 dark:bg-sky-900 dark:text-slate-200 dark:hover:bg-blue-800"
          >
            Зарегистрироваться
          </button>
        </form>
      </div>
    </main>
  );
}
