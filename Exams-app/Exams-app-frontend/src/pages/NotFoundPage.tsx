import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col gap-2">
      <div>Ошибка: страница не найдена</div>
      <div>
        <Link to="/" className="text-blue-500 underline">
          перейти на главную страницу
        </Link>
      </div>
    </div>
  );
}
