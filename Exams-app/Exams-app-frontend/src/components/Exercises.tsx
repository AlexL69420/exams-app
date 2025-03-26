import React, { useEffect, useState } from "react";
import axios from "axios";
import { LOCAL_API_URL } from "../enviroment";

interface IExercise {
  Id: number;
  Description: string;
  Problem: string;
  Solution: string;
  Answer: string;
}

interface ExercisesListProps {
  isConstructorMode?: boolean; // Режим конструктора
  onSelectExercise?: (exercise: IExercise) => void; // Обработчик выбора задания
  selectedExercises?: IExercise[]; // Выбранные задания
}

export default function ExercisesList({
  isConstructorMode = false,
  onSelectExercise,
  selectedExercises = [],
}: ExercisesListProps) {
  // Состояние для обработки ошибок
  const [error, setError] = useState<string | null>(null);
  // Состояние для хранения списка упражнений
  const [exercises, setExercises] = useState<IExercise[]>([]);
  // Состояние для обработки загрузки
  const [loading, setLoading] = useState<boolean>(true);
  // Состояние для поискового запроса
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Состояние для хранения видимости решений для каждого задания
  const [showSolution, setShowSolution] = useState<{ [key: number]: boolean }>(
    {},
  );

  // Функция для загрузки заданий с бекенда
  const fetchExercises = async () => {
    try {
      const response = await axios.get<IExercise[]>(
        `${LOCAL_API_URL}api/exercises`,
      );
      setExercises(response.data); // Сохраняем данные в состояние
      setLoading(false); // Загрузка завершена
    } catch (err) {
      setError("Ошибка при загрузке данных"); // Обработка ошибки
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleShowSolution = (exerciseId: number) => {
    setShowSolution((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  // Обработчик выбора задания
  const handleSelectExercise = (exercise: IExercise) => {
    if (isConstructorMode && onSelectExercise) {
      onSelectExercise(exercise);
    }
  };

  // Проверка, выбрано ли задание
  const isExerciseSelected = (exerciseId: number) => {
    return selectedExercises.some((ex) => ex.Id === exerciseId);
  };

  // Фильтрация заданий по поисковому запросу
  const filteredExercises = exercises.filter((exercise) =>
    exercise.Description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
    <main className="flex min-h-screen w-3/5 flex-col items-center gap-4 bg-zinc-100 px-2 py-3 text-black dark:bg-slate-700 dark:text-white">
      {/* Поле для поиска */}
      <input
        type="text"
        placeholder="Поиск по описанию..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-1/3 rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-600"
      />

      <div className="flex flex-col gap-4 p-5">
        {filteredExercises.length > 0 ? (
          <ul>
            {filteredExercises.map((exercise) => (
              <li key={exercise.Id}>
                <div
                  className={`mx-4 my-6 flex flex-col gap-2 rounded-2xl border-2 p-5 ${
                    isConstructorMode ? "hover:cursor-pointer " : ""
                  } ${
                    isConstructorMode && isExerciseSelected(exercise.Id)
                      ? "bg-gray-200 hover:cursor-pointer dark:bg-gray-600"
                      : ""
                  }`}
                  onClick={() => handleSelectExercise(exercise)} // Выбор задания
                >
                  <h2 className="font-bold">{exercise.Description}: </h2>
                  <p className="font-sans">{exercise.Problem}</p>
                  {!isConstructorMode && (
                    <div
                      className="text-gray-600 hover:cursor-pointer hover:underline dark:text-slate-300"
                      onClick={() => handleShowSolution(exercise.Id)}
                    >
                      {showSolution[exercise.Id]
                        ? "Скрыть решение"
                        : "Показать решение"}
                    </div>
                  )}
                  {!isConstructorMode && showSolution[exercise.Id] && (
                    <>
                      {exercise.Solution && <p>{exercise.Solution}</p>}
                      {exercise.Answer && (
                        <p className="font-bold">Ответ: {exercise.Answer}</p>
                      )}
                    </>
                  )}
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
