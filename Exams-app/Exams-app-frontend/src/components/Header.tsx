import { Link } from "react-router-dom";
("use client");

import { Dropdown, DarkThemeToggle, Avatar } from "flowbite-react";

import { VscAccount } from "react-icons/vsc";
import { FaBook } from "react-icons/fa";

import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { user } = useAuth();

  return (
    <main className="flex h-16 w-full items-center justify-around bg-indigo-600 dark:bg-slate-800">
      <div className="flex w-11/12 justify-between gap-2">
        <div className="flex h-12 flex-wrap items-center gap-1">
          <Avatar
            className={"w-12 text-white dark:text-red-800"}
            img={FaBook}
            alt="logo"
          />
          <h1 className="font-mono text-3xl italic  text-white dark:text-red-800">
            Экзамены
          </h1>
        </div>

        <div className="flex w-1/2 items-center justify-around  text-white dark:text-slate-300">
          <Dropdown label="Навигация" inline>
            <Link to="/">
              <Dropdown.Item>Главная</Dropdown.Item>
            </Link>
            <Link to="/exercises">
              <Dropdown.Item>Задания</Dropdown.Item>
            </Link>
            <Link to="/variants">
              <Dropdown.Item>Варианты</Dropdown.Item>
            </Link>
            <Link to="/courses">
              <Dropdown.Item>Курсы</Dropdown.Item>
            </Link>
          </Dropdown>

          <Dropdown label="Выбрать предмет" inline>
            <Link to="/">
              <Dropdown.Item>Информатика</Dropdown.Item>
            </Link>
            <Link to="/math">
              <Dropdown.Item>Математика</Dropdown.Item>
            </Link>
            <Link to="/ruslang">
              <Dropdown.Item>Русский Язык</Dropdown.Item>
            </Link>
            <Link to="/englang">
              <Dropdown.Item>Английский Язык</Dropdown.Item>
            </Link>
          </Dropdown>

          {/* 
          <Link to="/help">
            <h3 className="hover:underline">Помощь</h3>
          </Link>
          <Link to="/history">
            <h3 className="hover:underline">История</h3>
          </Link>
          */}

          {user && user.role === "superuser" ? (
            <Link to="/adminpage">
              {" "}
              <h3 className="hover:underline">
                Управление пользователями
              </h3>{" "}
            </Link>
          ) : (
            ""
          )}
          {user && (user.role === "superuser" || user.role === "author") ? (
            <Link to="/constructor">
              {" "}
              <h3 className="hover:underline">Конструктор</h3>{" "}
            </Link>
          ) : (
            ""
          )}
        </div>

        <div className="flex w-1/6 flex-row items-center justify-around">
          <div className=" text-white dark:text-slate-300">
            {!user ? (
              <Link to="/auth">
                <h3 className="hover:underline">Вход</h3>
              </Link>
            ) : (
              <Link to="/profile">
                <h1 className="text-white">{user.username}</h1>
              </Link>
            )}
          </div>

          <div className="flex flex-row gap-4">
            <Link to="/profile">
              {user?.usericon ? (
                <img
                  src={user.usericon}
                  alt={user.username[0]} // Используем первую букву имени как альтернативный текст
                  className="size-12 rounded-full object-cover"
                />
              ) : (
                <Avatar
                  img={VscAccount}
                  className="size-12 rounded-full border-2 border-white text-white  hover:bg-blue-600  dark:border-slate-500 dark:text-slate-500 dark:hover:bg-slate-700"
                  rounded
                />
              )}
            </Link>

            <DarkThemeToggle className="flex size-12 items-center justify-around rounded-full border-2 border-white text-white  hover:bg-blue-600  dark:border-slate-500 dark:text-slate-500 dark:hover:bg-slate-700" />
          </div>
        </div>
      </div>
    </main>
  );
}
