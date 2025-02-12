import { Router } from "express";
import usersRouter from './users.mjs';
import variantsRouter from './variants.mjs';
import exercisesRouter from './exercises.mjs';

const router = Router();

router.use('/api/users', usersRouter);
router.use('/api/variants',variantsRouter);
router.use('/api/exercises', exercisesRouter);

export default router;