import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import passport from 'passport';
import indexRouter from './routes/index.mjs'
import pool from './utils/data.mjs';
import './strategies/local-strategy.mjs';

const PgSession = pgSession(session);

const app = express();
app.use(express.json({ limit: '10mb' })); 

app.use(cors({
    origin: 'http://localhost:5173', // Указываем конкретный домен фронтенда
    credentials: true, // Разрешаем отправку кук
    
  }));

// Обработка preflight-запросов
app.options('*', cors()); // Разрешаем preflight для всех маршрутов

app.use(session(
    {
    store: new PgSession({
        pool: pool, // Используем пул подключений к PostgreSQL
        tableName: "session", // Название таблицы для хранения сессий
    }), 
    secret: "TzOu5>EbBayK",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60 * 12, 
        httpOnly: true,
        secure: false, // Отключаем в development
        //secure: process.env.NODE_ENV === 'production', // Используйте HTTPS в production
        sameSite: 'lax', // Защита от CSRF 
        },
    }
))
app.use(passport.initialize())
app.use(passport.session())

app.use(indexRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`server listening on port ${PORT}`);
});

app.get('/', (req, res)=>{
    res.status(200).send('hello world');
})
