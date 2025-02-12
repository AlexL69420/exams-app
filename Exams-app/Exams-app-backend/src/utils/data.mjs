import pkg from 'pg';

const {Pool} = pkg;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ExamApp',
    password: 'S2004A24S',
    port: 5432,
});

export default pool;