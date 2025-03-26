import React, { useEffect, useState } from "react";
import axios from "axios";
import { LOCAL_API_URL } from "../enviroment";
import { Button, TextInput } from "flowbite-react";
import { Dropdown } from "flowbite-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import dataFormatter from "../services/dataFormatter";
("use client");

// Интерфейс для данных статьи
interface Article {
  VariantId: number;
  Name: string;
  Date: string;
  Author: string;
  Difficulty: string;
  Content: number[];
}

export default function Body() {
  // Состояние для хранения списка статей
  const [articles, setArticles] = useState<Article[]>([]);
  // Состояние для обработки загрузки
  const [loading, setLoading] = useState<boolean>(true);
  // Состояние для обработки ошибок
  const [error, setError] = useState<string | null>(null);
  // Состояние для выбора уровня сложности
  const [difficulty, setDifficulty] = useState<string | null>("easy");
  //состояние для поиска варианта по id
  const [searchID, setSearchID] = useState<number | null>(null);

  const navigate = useNavigate();

  // Функция для загрузки последних вариантов с бекенда
  const fetchArticles = async () => {
    try {
      const response = await axios.get<Article[]>(
        `${LOCAL_API_URL}api/variants/recent`,
      );
      setArticles(response.data); // Сохраняем данные в состояние
      setLoading(false); // Загрузка завершена
      console.log(response.data);
    } catch (err) {
      setError("Ошибка при загрузке данных"); // Обработка ошибки
      setLoading(false);
    }
  };

  //
  const fetchRandomVariantByDifficulty = async () => {
    try {
      const response = await axios.get(
        `${LOCAL_API_URL}api/variants/random/${difficulty}`,
      );
      navigate(`/variant/${response.data.VariantId}`);
      setError("");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error);
        setLoading(false);
      } else {
        setError("An unexpected error occurred");
        setLoading(false);
      }
    }
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (!loading) {
      console.log("Обновлённое состояние articles:", articles);
    }
  }, [articles, loading]);

  // Отображение состояния загрузки
  if (loading) {
    return (
      <div className="min-h-screen w-3/5 px-2 py-3 text-black dark:bg-slate-700 dark:text-white">
        Загрузка...
      </div>
    );
  }

  // Отображение ошибки
  if (error) {
    return (
      <div className="min-h-screen w-3/5 px-2 py-3 text-black dark:bg-slate-700 dark:text-white">
        {error}
      </div>
    );
  }

  return (
    <main className="flex min-h-screen w-3/5 flex-col items-center gap-4 bg-zinc-100 px-2 py-3 text-black dark:bg-slate-700 dark:text-white">
      <h1 className="font-mono text-3xl font-bold  text-black dark:text-red-400">
        Демонстрационная версия станции КЕГЭ
      </h1>
      <p className="px-10">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum
        commodi inventore fugiat corporis quisquam sint et nemo sit minima eum
        repellat soluta suscipit, quae minus officiis pariatur natus vero
        consequuntur. Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Eaque consequuntur libero nesciunt iusto assumenda earum architecto
        voluptatem doloribus ullam dolores fugit quod, voluptas in dolorem,
        atque et? Id, eos ad.
      </p>
      <div className="flex w-2/3 flex-col gap-2 px-2">
        <h1 className="font-mono text-2xl italic  text-black dark:text-red-400">
          Новые варианты
        </h1>
        <div className="flex flex-col gap-4 rounded-2xl border-2 bg-white p-5 dark:bg-slate-600">
          {articles.length > 0 ? (
            <ul>
              {articles.map((article) => (
                <li key={article.VariantId}>
                  <div
                    className="flex flex-row gap-2 hover:cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-400"
                    onClick={() => navigate(`/variant/${article.VariantId}`)}
                  >
                    <p>{dataFormatter(article.Date)}: </p>
                    <h2 className="font-bold hover:underline">
                      {article.Name}
                    </h2>
                    <p> by {article.Author}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Нет данных для отображения</p>
          )}
          <Link
            to="/variants"
            className=" text-gray-400 hover:underline dark:text-gray-300"
          >
            {" "}
            ещё варианты...
          </Link>
        </div>
      </div>

      <p className="px-10">
        Также вы можете найти нужный вариант по его номеру или выбрать вариант
        по его сложности. В случае выбора варианта по номеру, введите номер в
        поле и нажмите на кнопку "Начать экзамен". Для начала выполнения
        варианта по сложности, выберите нужную вам сложность и нажмите на кнопку
        "Начать экзамен" справа. после этого для вас будет подобран случайный
        вариант выбранной сложности.
      </p>

      <div className="flex flex-row items-center justify-between gap-5 px-10">
        <div className="flex flex-col">
          <p>Введите номер КИМ</p>
          <div className="flex flex-row gap-2">
            <TextInput
              id="kimID"
              placeholder="Номер КИМ"
              onChange={(e) => setSearchID(parseInt(e.target.value))}
            ></TextInput>
            <Button
              color="light"
              onClick={() => navigate(`/variant/${searchID}`)}
            >
              Начать экзамен
            </Button>
          </div>
        </div>
        <h1>или</h1>
        <div className="flex flex-col">
          <p>Выберите сложность</p>
          <div className="flex flex-row gap-2">
            <div className="w-32">
              <Dropdown color="light" label={difficulty} dismissOnClick={false}>
                <Dropdown.Item onClick={() => setDifficulty("easy")}>
                  easy
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setDifficulty("medium")}>
                  medium
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setDifficulty("hard")}>
                  hard
                </Dropdown.Item>
              </Dropdown>
            </div>
            <Button color="light" onClick={fetchRandomVariantByDifficulty}>
              Начать экзамен
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
