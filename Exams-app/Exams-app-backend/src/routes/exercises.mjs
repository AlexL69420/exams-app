import { Router } from "express";
import pool from "../utils/data.mjs";

const router = Router();

// Маршрут для создания задания
router.post('/', async (req, res) => {
    const { description, problem, solution, answer } = req.body;
  
    try {
      const result = await pool.query(
        'SELECT * FROM "CreateExercise"($1, $2, $3, $4)',
        [description, problem, solution, answer]
      );
  
      // Возвращаем созданное задание
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Ошибка при создании задания:', err);
      res.status(500).json({ error: 'Ошибка при создании задания' });
    }
  });
  
  // Маршрут для получения всех заданий
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "GetAllExercises"()');
  
      // Возвращаем все задания
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Ошибка при получении заданий:', err);
      res.status(500).json({ error: 'Ошибка при получении заданий' });
    }
  });

  // Маршрут для получения заданий по ID
  router.get('/array/:ids', async (req, res) => {
    const { ids } = req.params;
    console.log(ids);
    console.log(typeof ids); // Log the type of ids
    try {
      const idArray = ids.split(','); // Convert string to array
      // Преобразуем массив строк в массив целых чисел
      const intIds = idArray.map(id => parseInt(id, 10));
      const result = await pool.query('SELECT * FROM "GetExercisesByIds"($1)', [intIds]);
  
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Ошибка при получении заданий:', err);
      res.status(500).json({ error: 'Ошибка при получении заданий' });
    }
  });
  
  // Маршрут для получения задания по ID
  router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const result = await pool.query('SELECT * FROM "GetExerciseById"($1)', [parseInt(id)]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Задание не найдено' });
      }
  
      // Возвращаем задание по ID
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error('Ошибка при получении задания:', err);
      res.status(500).json({ error: 'Ошибка при получении задания' });
    }
  });
  

export default router;