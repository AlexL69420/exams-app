import { Router } from "express";
import pool from "../utils/data.mjs";

const router = Router();

// Роут для удаления варианта по ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('SELECT "DeleteVariant"($1)', [parseInt(id)]);
      const isDeleted = result.rows[0].delete_variant_by_id;
  
      if (isDeleted) {
        res.status(200).json({ message: 'Variant deleted successfully' });
      } else {
        res.status(404).json({ error: 'Variant not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // маршрут для получения всех вариантов
router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "GetAllVariants"()');
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Роут для создания варианта
router.post('/', async (req, res) => {
    const { name, date, author, difficulty,  content } = req.body;
  
    if (!name || !date || !author || !difficulty || !content) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      const result = await pool.query(
        'SELECT * FROM "CreateVariant"($1, $2, $3, $4, $5)',
        [name, date, author, difficulty, content]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Маршрут для получения последних пяти вариантов
router.get('/recent', async (req, res) => {
    try {
        // Выполняем SQL-запрос для получения всех статей
        const { rows } = await pool.query('SELECT * FROM "GetLastFiveVariants"();');
        console.log(rows);
        
        // Отправляем данные в формате JSON
        res.json(rows);
    } catch (err) {
        console.error('Ошибка при выполнении запроса:', err);
        res.status(500).send('Ошибка сервера');
        }
  });

  router.get('/random/:difficulty', async (req, res) => {
    const { difficulty } = req.params;
  
    try {
      const result = await pool.query('SELECT * FROM "GetRandomVariantByDifficulty"($1)', [difficulty]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Варианты с указанной сложностью не найдены' });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error('Ошибка при получении случайного варианта:', err);
      res.status(500).json({ error: 'Ошибка при получении случайного варианта' });
    }
  });

    // Роут для поиска варианта по ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
        console.log(id)
      const result = await pool.query('SELECT * FROM "GetVariantById"($1)', [parseInt(id)]);
  
      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ error: 'Variant not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


export default router;