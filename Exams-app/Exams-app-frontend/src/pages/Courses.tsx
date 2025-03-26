import React, { useEffect, useState } from "react";
import { MyFooter } from "../components/Footer";
import Header from "../components/Header";

export default function Courses() {
  // Состояние для обработки ошибок
  const [error, setError] = useState<string | null>(null);

  // Состояние для обработки загрузки
  const [loading, setLoading] = useState<boolean>(true);

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
      <div className="flex min-h-screen w-3/5 flex-col items-center gap-4 bg-zinc-100 px-2 py-3 text-black dark:bg-slate-700 dark:text-white">
        <div>эта страница будет добавлена позже</div>
      </div>
      <MyFooter />
    </main>
  );
}
