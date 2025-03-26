import React, { useEffect, useState } from "react";
import axios from "axios";
import { LOCAL_API_URL } from "../enviroment";
import { useNavigate } from "react-router-dom";
import dataFormatter from "../services/dataFormatter";
import Header from "../components/Header";
import { MyFooter } from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { HiTrash } from "react-icons/hi";

interface IVariant {
  VariantId: number;
  Name: string;
  Date: string;
  Author: string;
  Difficulty: string;
  Content: number[];
}

export default function VariantsList() {
  // Состояние для обработки ошибок
  const [error, setError] = useState<string | null>(null);
  // Состояние для хранения списка вариантов
  const [variants, setVariants] = useState<IVariant[]>([]);
  // Состояние для обработки загрузки
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const { user } = useAuth(); // Получаем текущего пользователя

  // Функция для загрузки вариантов с бекенда
  const fetchVariants = async () => {
    try {
      const response = await axios.get<IVariant[]>(
        `${LOCAL_API_URL}api/variants`,
      );
      setVariants(response.data); // Сохраняем данные в состояние
      setLoading(false); // Загрузка завершена
      console.log(response.data);
    } catch (err) {
      setError("Ошибка при загрузке данных"); // Обработка ошибки
      setLoading(false);
    }
  };

  // Функция для удаления варианта
  const handleDeleteVariant = async (variantId: number) => {
    try {
      const response = await axios.delete(
        `${LOCAL_API_URL}api/variants/${variantId}`,
        { withCredentials: true },
      );
      if (response.status === 200) {
        setError(null);
        setVariants((prev) =>
          prev.filter((variant) => variant.VariantId !== variantId),
        ); // Удаляем вариант из списка
      }
    } catch (err) {
      setError("Ошибка при удалении варианта");
    }
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  // Отображение состояния загрузки
  if (loading) {
    return (
      <div className="min-h-screen px-2 py-3 text-black dark:bg-slate-700 dark:text-white">
        Загрузка...
      </div>
    );
  }

  // Отображение ошибки
  if (error) {
    return (
      <div className="min-h-screen px-2 py-3 text-black dark:bg-slate-700 dark:text-white">
        {error}
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-2 dark:bg-slate-600">
      <Header />
      <div className="flex min-h-screen w-3/5 flex-col items-center gap-4 bg-zinc-100 px-2 py-3 text-black dark:bg-slate-700 dark:text-white">
        <div className="flex flex-col p-5">
          {variants.length > 0 ? (
            <ul>
              {variants.map((variant) => (
                <li key={variant.VariantId}>
                  <div className="mb-2 flex flex-row items-center justify-between gap-2 text-xl hover:bg-slate-200 dark:hover:bg-slate-400">
                    <div
                      className="flex flex-row gap-2 hover:cursor-pointer"
                      onClick={() => navigate(`/variant/${variant.VariantId}`)}
                    >
                      <p>{dataFormatter(variant.Date)}: </p>
                      <h2 className="font-bold hover:underline">
                        {variant.Name}
                      </h2>
                      <p> by {variant.Author}</p>
                    </div>
                    {/* Кнопка удаления для суперпользователей и авторов */}
                    {(user?.role === "superuser" ||
                      user?.role === "author") && (
                      <button
                        onClick={() => handleDeleteVariant(variant.VariantId)}
                        className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                      >
                        <HiTrash>g</HiTrash>
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Нет данных для отображения</p>
          )}
        </div>
      </div>
      <MyFooter />
    </main>
  );
}
