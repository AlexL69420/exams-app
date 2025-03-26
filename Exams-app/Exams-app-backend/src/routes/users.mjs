import { Router } from "express";
import pool from "../utils/data.mjs";
import passport from "passport";
import "../strategies/local-strategy.mjs";
import bcrypt from "bcrypt";
import { isSuperuser, isAuthenticated } from "../utils/middlewares.mjs";

const router = Router();

// Получение списка всех пользователей (только для суперпользователя)
router.get("/", isSuperuser, async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM \"GetAllUsers\"()");
      res.status(200).json(result.rows);
    } catch (err) {
      console.error("Ошибка при получении списка пользователей:", err);
      res.status(500).json({ error: "Ошибка при получении списка пользователей" });
    }
  });

// регистрация
router.post("/register", async (req, res) => {
    const { username, password, displayedName, userIcon, userDescription } = req.body;
  
    try {
      // Проверка уникальности username
      const userExists = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      if (userExists.rows.length > 0) {
        return res.status(400).json({ error: "Имя пользователя уже занято" });
      }
  
      // Хэширование пароля
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Создание пользователя с ролью "regular" по умолчанию
      const result = await pool.query(
        "INSERT INTO users (username, password, role, availablecourses, displayedname, usericon, userdescription) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [username, hashedPassword, "regular", [], displayedName, userIcon, userDescription]
      );
  
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Ошибка при создании пользователя:", err);
      res.status(500).json({ error: "Ошибка при создании пользователя" });
    }
  });

  // Изменение пароля
router.put("/change-password", isAuthenticated, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
  
    try {
      // Получаем текущий пароль пользователя
      const result = await pool.query("SELECT password FROM users WHERE id = $1", [userId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Пользователь не найден" });
      }
  
      const currentPasswordHash = result.rows[0].password;
  
      // Проверяем, совпадает ли старый пароль
      const isPasswordValid = await bcrypt.compare(oldPassword, currentPasswordHash);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Неверный старый пароль" });
      }
  
      // Хэшируем новый пароль
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
  
      // Обновляем пароль
      await pool.query("UPDATE users SET password = $1 WHERE id = $2", [newPasswordHash, userId]);
  
      res.status(200).json({ message: "Пароль успешно изменён" });
    } catch (err) {
      console.error("Ошибка при изменении пароля:", err);
      res.status(500).json({ error: "Ошибка при изменении пароля" });
    }
  });
  
  // Обновление профиля (displayedname, usericon, userdescription)
  router.put("/update-profile", isAuthenticated, async (req, res) => {
    const { displayedName, userIcon, userDescription } = req.body;
    const userId = req.user.id;
  
    try {
      // Обновляем данные пользователя
      const result = await pool.query(
        "UPDATE users SET displayedname = $1, usericon = $2, userdescription = $3 WHERE id = $4 RETURNING *",
        [displayedName, userIcon, userDescription, userId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Пользователь не найден" });
      }
  
      res.status(200).json({ message: "Профиль успешно обновлён", user: result.rows[0] });
    } catch (err) {
      console.error("Ошибка при обновлении профиля:", err);
      res.status(500).json({ error: "Ошибка при обновлении профиля" });
    }
  });

// Вход в аккаунт
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json({ message: "Успешный вход", user: req.user });
});

// Выход из профиля
router.post("/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Ошибка при выходе из профиля" });
      }
      res.status(200).json({ message: "Успешный выход" });
    });
  });

// Просмотр пользователя по id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка при получении пользователя:", err);
    res.status(500).json({ error: "Ошибка при получении пользователя" });
  }
});

// маршрут для изменения доступных пользователю курсов
router.put("/:id/available-courses", isSuperuser, async (req, res) => {
    const { id } = req.params;
    const { availableCourses } = req.body;
  
    try {
      // Обновляем список доступных курсов
      const result = await pool.query(
        "UPDATE users SET availablecourses = $1 WHERE id = $2 RETURNING *",
        [availableCourses, id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Пользователь не найден" });
      }
  
      res.status(200).json({ message: "Список курсов успешно обновлён", user: result.rows[0] });
    } catch (err) {
      console.error("Ошибка при обновлении списка курсов:", err);
      res.status(500).json({ error: "Ошибка при обновлении списка курсов" });
    }
  });

// Изменение роли пользователя (только для суперпользователя)
router.put("/:id/role", isSuperuser, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const result = await pool.query("UPDATE users SET role = $1 WHERE id = $2 RETURNING *", [role, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка при изменении роли пользователя:", err);
    res.status(500).json({ error: "Ошибка при изменении роли пользователя" });
  }
});

// Удаление пользователя (только для суперпользователя)
router.delete("/:id", isSuperuser, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.status(200).json({ message: "Пользователь удалён", user: result.rows[0] });
  } catch (err) {
    console.error("Ошибка при удалении пользователя:", err);
    res.status(500).json({ error: "Ошибка при удалении пользователя" });
  }
});


export default router;