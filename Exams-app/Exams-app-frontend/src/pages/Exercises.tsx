import React, { useEffect, useState } from "react";
import axios from "axios";
import { LOCAL_API_URL } from "../enviroment";

interface IExercise {
  ExerciseId: number;
  Description: string;
  Problem: string;
  Solution: string;
  Answer: string;
}

export default function ExercisesList() {
  // Состояние для обработки ошибок
  const [error, setError] = useState<string | null>(null);
  // Состояние для хранения списка упражнений
  const [exercises, setExercises] = useState<IExercise[]>([]);
  // Состояние для обработки загрузки
  const [loading, setLoading] = useState<boolean>(true);

  // Функция для загрузки заданий с бекенда
  const fetchExercises = async () => {
    try {
      const response = await axios.get<IExercise[]>(
        `${LOCAL_API_URL}api/exercises`,
      );
      setExercises(response.data); // Сохраняем данные в состояние
      setLoading(false); // Загрузка завершена
      console.log(response.data);
    } catch (err) {
      setError("Ошибка при загрузке данных"); // Обработка ошибки
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
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
      <div className="flex flex-col gap-4 p-5">
        {exercises.length > 0 ? (
          <ul>
            {exercises.map((exercise) => (
              <li key={exercise.ExerciseId}>
                <div className="mx-4 my-6 flex flex-col gap-2 rounded-2xl border-2 p-5">
                  <h2 className="font-bold">{exercise.Description}: </h2>
                  <p className="font-sans">{exercise.Problem}</p>
                  <p> {exercise.Solution}</p>
                  <p> {exercise.Answer}</p>
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
