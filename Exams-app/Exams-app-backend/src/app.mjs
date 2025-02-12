import express from 'express';
import cors from 'cors';
import session from 'express-session';
import indexRouter from './routes/index.mjs'

const app = express();
app.use(express.json()); 
app.use(cors());
app.use(indexRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`server listening on port ${PORT}`);
});

app.get('/', (req, res)=>{
    res.status(200).send('hello world');
})
