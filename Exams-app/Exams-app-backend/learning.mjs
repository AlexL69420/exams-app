import express from 'express';
import { request } from 'http';
import { Pool } from 'pg';

const app = express();
app.use(express.json()); 
const PORT = process.env.PORT || 5000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'PharmacyDB',
    password: 'S2004A24S',
    port: 5432,
});

app.get('/', (req, res)=>{
    res.status(200).send('hello world');
})

app.get('/api/users', (req, res)=>{
    const {query: {filter, value},} = req;
    //if (!filter && !value)
    //if (filter && value) {
    // return users.filter((user) => user[filter].uncludes(value))} ...
    res.status(200).send({id: 1, username: "Alex", });
})

app.get('/api/user/:id', (req, res)=>{
    console.log(req.params);
    const parsedId = parseInt(req.params.id);
    if(isNaN(parsedId)){return res.sendStatus(400);}
    //const findUser = users.find((user) => user.id === parsedId)
    if (!findUser){return res.sendStatus(404)}
    //res.status(200).send({id: 1, username: "Alex", });
})

app.post('/api/users', (req, res)=>{
    return res.send(200);
})

app.listen(PORT, ()=>{
    console.log(`server listening on port ${PORT}`);
});