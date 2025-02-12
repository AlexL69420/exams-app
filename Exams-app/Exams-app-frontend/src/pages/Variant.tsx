import React, { useEffect, useState } from "react";
import axios from "axios";
import { LOCAL_API_URL } from "../enviroment";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import { MyFooter } from "../components/Footer";
import dataFormatter from "../services/dataFormatter";
import { TextInput, Button } from "flowbite-react";

interface IVariant {
  VariantId: number;
  Name: string;
  Date: string;
  Author: string;
  Difficulty: string;
  Content: string[];
}

interface IExercise {
  ExerciseId: number;
  Description: string;
  Problem: string;
  Solution: string;
  Answer: string;
}

export default function Variant() {
  const { id } = useParams();
  const [variant, setVariant] = useState<IVariant | null>(null);
  const [exercises, setExercises] = useState<IExercise[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSolution, setShowSolution] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [givenAnswer, setGivenAnswer] = useState<{ [key: number]: string }>({});
  const [results, setResults] = useState<{ [key: number]: boolean }>({});
  const [isTestCompleted, setIsTestCompleted] = useState<boolean>(false);

  // Состояния для таймера
  const [timeLeft, setTimeLeft] = useState<number>(1800); // 30 минут в секундах
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [timerPaused, setTimerPaused] = useState<boolean>(false);

  // Запуск таймера
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isTimerRunning && !timerPaused && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      handleCompleteTest(); // Завершить тестирование, когда время вышло
      setIsTimerRunning(false);
    }

    return () => clearInterval(timer);
  }, [isTimerRunning, timerPaused, timeLeft]);

  // Форматирование времени в формат MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Пауза/возобновление таймера
  const handlePauseResumeTimer = () => {
    setTimerPaused((prev) => !prev);
  };

  const handleFind = async () => {
    try {
      console.log(id);
      const response = await axios.get(`${LOCAL_API_URL}api/variants/${id}`);
      setVariant(response.data);
      await fetchVariantExercises(response.data);
      setError("");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error);
        setLoading(false);
      } else {
        setError("An unexpected error occurred");
        setLoading(false);
      }
      setVariant(null);
    }
  };

  const fetchVariantExercises = async (lvariant: IVariant) => {
    console.log(lvariant);
    try {
      const response = await axios.get<IExercise[]>(
        `${LOCAL_API_URL}api/exercises/array/${lvariant.Content.join(",")}`,
      );
      setExercises(response.data);
      setLoading(false);
      console.log(response.data);
    } catch (err) {
      setError("Ошибка при загрузке данных");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      handleFind();
    } else {
      <div>no id</div>;
    }
  }, []);

  const handleShowSolution = (exerciseId: number) => {
    setShowSolution((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  const handleGivenAnswer = (exerciseId: number, newAnswer: string) => {
    setGivenAnswer((prev) => ({
      ...prev,
      [exerciseId]: newAnswer,
    }));
  };

  const handleCompleteTest = () => {
    const newResults: { [key: number]: boolean } = {};
    exercises.forEach((exercise, index) => {
      newResults[index] = exercise.Answer === givenAnswer[index];
    });
    setResults(newResults);
    setIsTestCompleted(true);
    setIsTimerRunning(false); // Остановить таймер после завершения тестирования
  };

  const calculateScore = () => {
    return Object.values(results).filter((result) => result).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen px-2 py-3 text-black dark:bg-slate-700 dark:text-white">
        Загрузка...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen px-2 py-3 text-black dark:bg-slate-700 dark:text-white">
        {error}
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-2 dark:bg-slate-600">
      <Header></Header>
      <div className="flex min-h-screen w-3/5 flex-col items-center gap-4 bg-zinc-200 px-2 py-3 text-black dark:bg-slate-700 dark:text-white">
        <div className="flex flex-row items-center gap-4">
          <div className="font-bold">{variant?.Name}</div>
          <div className="">{dataFormatter(variant?.Date)}</div>
          <div className="flex flex-row gap-2 font-serif">
            <h2>Сложность:</h2>
            <h2 className="font-bold">{variant?.Difficulty}</h2>
          </div>
          <div className="">{variant?.Author}</div>
        </div>

        <div className="flex flex-row items-center gap-4 rounded-2xl border-2 bg-white p-2 dark:bg-slate-600">
          <div className="font-bold">
            Осталось времени: {formatTime(timeLeft)}
          </div>
          <Button color="light" onClick={handlePauseResumeTimer}>
            {timerPaused ? "Возобновить" : "Пауза"}
          </Button>
        </div>

        <div className="flex flex-col gap-4 p-5">
          {exercises.length > 0 ? (
            <ul>
              {exercises.map((exercise, index) => (
                <li key={exercise.ExerciseId}>
                  <div
                    className={`mx-4 my-6 flex flex-col gap-2 rounded-2xl border-2  p-5 ${
                      isTestCompleted
                        ? results[index]
                          ? "bg-green-200 dark:bg-green-400"
                          : "bg-red-200 dark:bg-red-400"
                        : " bg-white dark:bg-slate-600"
                    }`}
                  >
                    <h2 className="font-bold">{exercise.Description}: </h2>
                    <p className="font-sans">{exercise.Problem}</p>
                    <div
                      className="text-gray-600 hover:cursor-pointer hover:underline dark:text-slate-300"
                      onClick={() => handleShowSolution(exercise.ExerciseId)}
                    >
                      Показать решение
                    </div>
                    {showSolution[exercise.ExerciseId] && (
                      <>
                        {exercise.Solution && <p>{exercise.Solution}</p>}
                        {exercise.Answer && (
                          <p className="font-bold">Ответ: {exercise.Answer}</p>
                        )}
                      </>
                    )}
                    {isTestCompleted ? (
                      <>
                        <p>Ваш ответ: {givenAnswer[index]}</p>
                        <p>Правильный ответ: {exercise.Answer}</p>
                      </>
                    ) : (
                      <TextInput
                        placeholder="введите ответ"
                        onChange={(e) =>
                          handleGivenAnswer(index, e.target.value)
                        }
                      ></TextInput>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Нет данных для отображения</p>
          )}
        </div>

        {isTestCompleted && (
          <div className="font-bold">
            Количество набранных баллов: {calculateScore()}
          </div>
        )}

        {isTestCompleted ? (
          <Link to="/">
            <Button color="light">Вернуться на главную</Button>
          </Link>
        ) : (
          <Button color="light" onClick={handleCompleteTest}>
            Завершить тестирование
          </Button>
        )}
      </div>
      <MyFooter></MyFooter>
    </main>
  );
}
