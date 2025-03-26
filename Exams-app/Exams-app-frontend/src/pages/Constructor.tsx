"use client";

import { ListGroup } from "flowbite-react";
import React, { useState } from "react";
import { MyFooter } from "../components/Footer";
import Header from "../components/Header";
import axios from "axios";
import { LOCAL_API_URL } from "../enviroment";
import ExercisesList from "../components/Exercises";
import { useAuth } from "../contexts/AuthContext";
import dataFormatter from "../services/dataFormatter";

interface IExercise {
  Id: number;
  Description: string;
  Problem: string;
  Solution: string;
  Answer: string;
}

export default function Constructor() {
  const { user } = useAuth(); // Получаем данные пользователя
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showExercisesConstructor, setShowExercisesConstructor] =
    useState<boolean>(true);
  const [exerciseData, setExerciseData] = useState({
    description: "",
    problem: "",
    solution: "",
    answer: "",
  });
  const [selectedExercises, setSelectedExercises] = useState<IExercise[]>([]);

  // Состояние для атрибутов варианта
  const [variantData, setVariantData] = useState({
    name: "",
    difficulty: "medium", // По умолчанию средняя сложность
  });

  // Обработчик изменения полей формы варианта
  const handleVariantInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setVariantData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Обработчик выбора задания
  const handleSelectExercise = (exercise: IExercise) => {
    if (!selectedExercises.some((ex) => ex.Id === exercise.Id)) {
      setSelectedExercises((prev) => [...prev, exercise]);
    }
  };

  // Обработчик удаления задания
  const handleRemoveExercise = (exerciseId: number) => {
    setSelectedExercises((prev) => prev.filter((ex) => ex.Id !== exerciseId));
  };

  // Обработчик отправки варианта на сервер
  const handleSubmitVariant = async () => {
    if (
      !variantData.name ||
      !variantData.difficulty ||
      selectedExercises.length === 0
    ) {
      setError(
        "Все поля обязательны для заполнения, и должен быть выбран хотя бы один вариант.",
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const currentDate = new Date().toISOString(); // Текущая дата в формате ISO
      const formattedDate = dataFormatter(currentDate); // Форматируем дату

      const content = selectedExercises.map((ex) => ex.Id); // Массив ID заданий

      const response = await axios.post(
        `${LOCAL_API_URL}api/variants/`,
        {
          name: variantData.name,
          date: formattedDate,
          author: user?.username || "Аноним", // Используем никнейм пользователя
          difficulty: variantData.difficulty,
          content: content,
        },
        { withCredentials: true },
      );

      console.log("Вариант создан:", response.data);
      alert("Вариант успешно создан!");

      // Очищаем состояние
      setSelectedExercises([]);
      setVariantData({ name: "", difficulty: "medium" });
    } catch (err) {
      console.error("Ошибка при создании варианта:", err);
      setError("Ошибка при создании варианта");
    } finally {
      setLoading(false);
    }
  };

  // Обработчик изменения полей формы
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setExerciseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Обработчик отправки формы с использованием axios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Отправляем POST-запрос с помощью axios
      const response = await axios.post(
        `${LOCAL_API_URL}api/exercises/`,
        exerciseData,
        { withCredentials: true },
      );

      // Если запрос успешен
      console.log("Задание создано:", response.data);
      alert("Задание успешно создано!");
      setExerciseData({
        description: "",
        problem: "",
        solution: "",
        answer: "",
      }); // Очистка формы
    } catch (err) {
      // Обрабатываем ошибку
      console.error("Ошибка:", err);
      setError("Ошибка при создании задания");
    } finally {
      setLoading(false);
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

  return (
    <main className="flex min-h-screen flex-col items-center gap-2 dark:bg-slate-600">
      <Header />
      <div className="flex min-h-screen w-11/12 flex-row items-start gap-4 bg-zinc-100 px-2 py-3 text-black dark:bg-slate-700 dark:text-white">
        {/* Список для выбора конструктора */}
        <ListGroup className="w-48">
          <ListGroup.Item
            onClick={() => setShowExercisesConstructor(true)}
            active={showExercisesConstructor}
          >
            Конструктор заданий
          </ListGroup.Item>
          <ListGroup.Item
            onClick={() => setShowExercisesConstructor(false)}
            active={!showExercisesConstructor}
          >
            Конструктор вариантов
          </ListGroup.Item>
        </ListGroup>

        {/* Отображение выбранного конструктора */}
        <div className="mt-4 size-full min-h-screen">
          {showExercisesConstructor ? (
            <div className="size-full min-h-screen rounded-lg border bg-white p-4 dark:bg-slate-800">
              <h2 className="mb-4 text-xl font-bold">Конструктор заданий</h2>
              {/* Форма для создания задания */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Описание задания
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={exerciseData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="problem"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Условие задачи
                  </label>
                  <textarea
                    id="problem"
                    name="problem"
                    value={exerciseData.problem}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="solution"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Решение
                  </label>
                  <textarea
                    id="solution"
                    name="solution"
                    value={exerciseData.solution}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="answer"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Ответ
                  </label>
                  <input
                    type="text"
                    id="answer"
                    name="answer"
                    value={exerciseData.answer}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  Создать задание
                </button>
              </form>
            </div>
          ) : (
            <div className="flex size-full min-h-screen flex-row gap-2 p-4">
              <div className="min-h-0.5 w-1/2 rounded-lg border bg-white p-4 dark:bg-slate-800">
                <h2 className="mb-4 text-xl font-bold">
                  Конструктор вариантов
                </h2>

                {/* Поля для ввода атрибутов варианта */}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Название варианта
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={variantData.name}
                      onChange={handleVariantInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="difficulty"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Сложность
                    </label>
                    <select
                      id="difficulty"
                      name="difficulty"
                      value={variantData.difficulty}
                      onChange={handleVariantInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      required
                    >
                      <option value="easy">Легкий</option>
                      <option value="medium">Средний</option>
                      <option value="hard">Сложный</option>
                    </select>
                  </div>
                </div>

                {/* Список выбранных заданий */}
                <ul className="mt-4">
                  {selectedExercises.map((exercise) => (
                    <li
                      key={exercise.Id}
                      className="flex items-center justify-between p-2"
                    >
                      <span>{exercise.Description}</span>
                      <button
                        onClick={() => handleRemoveExercise(exercise.Id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Удалить
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Кнопка для создания варианта */}
                <button
                  onClick={handleSubmitVariant}
                  className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  Создать вариант
                </button>
              </div>

              <div className="max-h-screen items-center overflow-y-auto rounded border-2 p-4">
                <ExercisesList
                  isConstructorMode
                  onSelectExercise={handleSelectExercise}
                  selectedExercises={selectedExercises}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <MyFooter />
    </main>
  );
}
