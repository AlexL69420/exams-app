import React, { useState, useEffect } from "react";
import axios from "axios";
import { LOCAL_API_URL } from "../enviroment";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import { MyFooter } from "../components/Footer";

interface User {
  Id: number;
  Username: string;
  DisplayedName: string;
  Role: string;
  UserDescription: string;
  UserIcon: string;
  AvailableCourses: number[];
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [availableCourses, setAvailableCourses] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const { user } = useAuth();

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>(`${LOCAL_API_URL}api/users/`, {
        withCredentials: true,
      });
      setUsers(response.data);
      console.log(response.data);
      setLoading(false); // Загрузка завершена
    } catch (err) {
      setError("Ошибка при загрузке пользователей");
      setLoading(false);
    }
  };

  useEffect(() => {
    // Проверка, что это суперюзер
    if (user && user.role !== "superuser") {
      setError("Эта страница доступна только админам");
      setLoading(false);
    } else {
      fetchUsers();
    }
  }, [user]);

  const handleUpdateCourses = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId) {
      setError("Выберите пользователя");
      return;
    }

    try {
      const response = await axios.put<User>(
        `${LOCAL_API_URL}api/users/${selectedUserId}/available-courses`,
        {
          availableCourses: availableCourses.split(",").map(Number),
        },
        { withCredentials: true },
      );
      setSuccess("Список курсов успешно обновлён");
      setError("");
      console.log("Обновлённый пользователь:", response.data);
      fetchUsers(); // Обновляем список пользователей после успешного обновления
    } catch (err) {
      setError("Ошибка при обновлении списка курсов");
      setSuccess("");
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    if (userId === user?.id) {
      setError("Вы не можете изменить свою роль");
      return;
    }

    try {
      const response = await axios.put(
        `${LOCAL_API_URL}api/users/${userId}/role`,
        { role: newRole },
        { withCredentials: true },
      );
      setSuccess("Роль пользователя успешно обновлена");
      setError("");
      console.log("Обновлённый пользователь:", response.data);
      fetchUsers(); // Обновляем список пользователей после успешного обновления
    } catch (err) {
      setError("Ошибка при изменении роли пользователя");
      setSuccess("");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (userId === user?.id) {
      setError("Вы не можете удалить самого себя");
      return;
    }

    try {
      const response = await axios.delete(
        `${LOCAL_API_URL}api/users/${userId}`,
        {
          withCredentials: true,
        },
      );
      setSuccess("Пользователь успешно удалён");
      setError("");
      console.log("Удалённый пользователь:", response.data);
      fetchUsers(); // Обновляем список пользователей после успешного удаления
    } catch (err) {
      setError("Ошибка при удалении пользователя");
      setSuccess("");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center gap-2 dark:bg-slate-600">
        <Header />
        <div className="flex min-h-screen w-3/5 flex-col items-center gap-4 bg-zinc-100 px-2 py-3 text-black dark:bg-slate-700 dark:text-white">
          <div className="min-h-screen px-2 py-3 text-black dark:bg-slate-700 dark:text-white">
            Загрузка...
          </div>
        </div>
        <MyFooter />
      </main>
    );
  }

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

  const selectedUser = users.find((user) => user.Id === selectedUserId);

  return (
    <main className="flex min-h-screen flex-col items-center gap-2 dark:bg-slate-600">
      <Header />
      <div className="flex min-h-screen w-3/5 flex-col items-center gap-4 bg-zinc-100 px-2 py-3 text-black dark:bg-slate-700 dark:text-white">
        {/* Сообщение об успехе */}
        {success && <div className="text-green-500">{success}</div>}

        {/* Список пользователей */}
        <h2 className="text-xl font-bold">Список пользователей</h2>
        <ul className="flex max-h-[60vh] flex-col items-center gap-4 overflow-y-auto rounded border-2 p-4">
          {users.map((user) => (
            <li
              key={user.Id}
              className={`flex w-full items-center justify-between rounded-lg border p-4 hover:bg-slate-200 dark:hover:bg-slate-600 ${
                selectedUserId === user.Id ? "bg-blue-100 dark:bg-blue-800" : ""
              }`}
            >
              <div className="flex flex-row items-center gap-8">
                <div className="flex flex-col">
                  <h3 className="font-bold">{user.DisplayedName}</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-300">
                    {user.Username}
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Роль:
                  </label>
                  <select
                    id="role"
                    value={user.Role}
                    onChange={(e) => handleRoleChange(user.Id, e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="superuser">superuser</option>
                    <option value="author">author</option>
                    <option value="premium">premium</option>
                    <option value="regular">regular</option>
                  </select>
                </div>
                {user.Role === "regular" && (
                  <p className="text-sm text-gray-600 dark:text-slate-300">
                    Доступные курсы:{" "}
                    {user.AvailableCourses
                      ? user.AvailableCourses.join(", ")
                      : "Нет доступных курсов"}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedUserId(user.Id)}
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Выбрать
                </button>
                <button
                  onClick={() => handleDeleteUser(user.Id)}
                  className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Форма для обновления доступных курсов */}
        {selectedUserId && (
          <form
            onSubmit={handleUpdateCourses}
            className="mt-8 flex w-5/6 flex-col gap-2 rounded-xl border-2 border-gray-500 p-4 dark:border-stone-200"
          >
            <div className="flex flex-col">
              <h2 className="text-xl font-bold">Обновить доступные курсы</h2>
              <div className="flex flex-row gap-2">
                <h2 className="">для пользователя</h2>{" "}
                <h2 className="font-serif font-bold">
                  {selectedUser?.Username}{" "}
                  {/* Никнейм выбранного пользователя */}
                </h2>
              </div>
            </div>
            <div className="space-y-4">
              <label htmlFor="availableCourses" className="block">
                Введите ID курсов через запятую:
              </label>
              <input
                type="text"
                id="availableCourses"
                value={availableCourses}
                onChange={(e) => setAvailableCourses(e.target.value)}
                className="w-full rounded border p-2"
                placeholder="Например: 1, 2, 3"
              />
              <button
                type="submit"
                className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                Обновить курсы
              </button>
            </div>
          </form>
        )}
      </div>
      <MyFooter />
    </main>
  );
}
