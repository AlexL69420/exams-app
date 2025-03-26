import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Avatar } from "flowbite-react";
import { VscAccount } from "react-icons/vsc";
import { LOCAL_API_URL } from "../enviroment";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import { MyFooter } from "../components/Footer";
import { ImageInput } from "../components/ImageInput";

// Интерфейс для данных пользователя
interface User {
  id: number;
  username: string;
  displayedname: string;
  role: string;
  userdescription: string;
  usericon: string;
  availablecourses: number[];
}

export default function ProfilePage() {
  const [displayedName, setDisplayedName] = useState<string>("");
  const [userIcon, setUserIcon] = useState<string>("");
  const [userDescription, setUserDescription] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    if (user) {
      const fetchUser = async () => {
        try {
          setDisplayedName(user.displayedname);
          setUserIcon(user.usericon);
          setUserDescription(user.userdescription);
        } catch (err) {
          setError("Ошибка при загрузке данных пользователя");
        }
      };

      fetchUser();
    } else {
      setError("Ошибка: нет пользователя");
    }
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${LOCAL_API_URL}api/users/update-profile`,
        {
          displayedName,
          userIcon,
          userDescription,
        },
        { withCredentials: true },
      );
      console.log(response.data);
      setError("");
      alert("Профиль успешно обновлён");
    } catch (err) {
      setError("Ошибка при обновлении профиля");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(`${LOCAL_API_URL}api/users/change-password`, {
        oldPassword,
        newPassword,
      });
      setError("");
      alert("Пароль успешно изменён");
    } catch (err) {
      setError("Ошибка при изменении пароля");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${LOCAL_API_URL}api/users/logout`);
      logout();
      navigate("/auth");
    } catch (err) {
      setError("Ошибка при выходе из аккаунта");
    }
  };

  const handleImageChange = async (url: string) => {
    if (user) {
      setUserIcon(url);
      user.usericon = userIcon;
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]); // Зависимости: user и navigate

  // Отображение ошибки
  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center gap-2 dark:bg-slate-600">
        <Header />
        <div className="flex min-h-screen w-3/5 flex-col items-center gap-4 bg-zinc-100 px-2 py-3 text-black dark:bg-slate-700 dark:text-white">
          <div className="min-h-screen px-2 py-3 text-black dark:bg-slate-700 dark:text-white">
            {error}
          </div>
        </div>
        <MyFooter />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-2 dark:bg-slate-600">
      <Header />
      <div className="flex min-h-screen w-3/5 flex-col items-center gap-4 bg-zinc-100 px-2 py-3 text-black dark:bg-slate-700 dark:text-white">
        <h1 className="mb-6 text-2xl font-bold">Профиль пользователя</h1>

        <div className="flex flex-row gap-4">
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
            <h2 className="w-5/6 border-2 border-white bg-zinc-300 p-2 dark:border-slate-500 dark:bg-slate-800">
              {userDescription}
            </h2>
          </div>
        </div>

        <div className="flex w-5/6 flex-col items-center gap-8 p-2">
          <form
            onSubmit={handleUpdateProfile}
            className="flex w-5/6 flex-col items-center rounded-xl border-2 border-gray-600  p-4 dark:border-slate-500"
          >
            <h2 className="mb-4 text-xl font-semibold">Обновление профиля</h2>
            <div className="flex w-5/6 flex-col items-center gap-4">
              <input
                type="text"
                placeholder="Отображаемое имя"
                value={displayedName}
                onChange={(e) => setDisplayedName(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-600 "
              />

              <ImageInput onImageChange={handleImageChange} />

              <textarea
                placeholder="Описание"
                value={userDescription}
                onChange={(e) => setUserDescription(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-600 "
              />
              <button
                type="submit"
                className="w-2/3 rounded-lg bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600 dark:bg-violet-800 dark:text-white dark:hover:bg-violet-800"
              >
                Сохранить изменения
              </button>
            </div>
          </form>

          <form
            onSubmit={handleChangePassword}
            className="flex w-5/6 flex-col items-center rounded-xl border-2 border-gray-600  p-4 dark:border-slate-500"
          >
            <h2 className="mb-4 text-xl font-semibold">Изменение пароля</h2>
            <div className="flex w-5/6 flex-col items-center gap-4">
              <input
                type="password"
                placeholder="Старый пароль"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-600 "
              />
              <input
                type="password"
                placeholder="Новый пароль"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-600 "
              />
              <button
                type="submit"
                className="w-2/3 rounded-lg bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600 dark:bg-violet-800 dark:text-white dark:hover:bg-violet-800"
              >
                Изменить пароль
              </button>
            </div>
          </form>

          <button
            onClick={handleLogout}
            className="w-2/3 rounded-lg bg-red-500 py-2 text-white transition duration-200 hover:bg-red-600 dark:bg-red-700 dark:text-white dark:hover:bg-red-600"
          >
            Выйти из аккаунта
          </button>
        </div>
      </div>
      <MyFooter />
    </main>
  );
}
