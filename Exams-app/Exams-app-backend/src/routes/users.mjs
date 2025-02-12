import { Router } from "express";
import pool from "../utils/data.mjs";

const router = Router();

router.get('/', (req, res)=>{
    res.status(200).send('hello world');
})

export default router;