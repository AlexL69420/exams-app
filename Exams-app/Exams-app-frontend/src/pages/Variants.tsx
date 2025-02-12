import React, { useEffect, useState } from "react";
import axios from "axios";
import { LOCAL_API_URL } from "../enviroment";
import { useNavigate } from "react-router-dom";
import dataFormatter from "../services/dataFormatter";

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
  // Состояние для хранения списка статей
  const [variants, setVariants] = useState<IVariant[]>([]);
  // Состояние для обработки загрузки
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

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
    <main>
      <div className="flex flex-col gap-4 rounded-2xl border-2 p-5">
        {variants.length > 0 ? (
          <ul>
            {variants.map((variant) => (
              <li key={variant.VariantId}>
                <div
                  className="flex flex-row gap-2  hover:cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-400"
                  onClick={() => navigate(`/variant/${variant.VariantId}`)}
                >
                  <p>{dataFormatter(variant.Date)}: </p>
                  <h2 className="font-bold hover:underline">{variant.Name}</h2>
                  <p> by {variant.Author}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Нет данных для отображения</p>
        )}
      </div>
    </main>
  );
}
