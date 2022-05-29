// import mysql from 'mysql2';
import mysql from 'mysql2/promise';

// DEV
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ridahung'
});

// VPS
// const connection = mysql.createPool({
//     host: 'localhost',
//     user: 'admin',
//     password: 'X9WSd4rOn6WZ80Tn',
//     database: 'yblq_q36clublfxy'
// });

export default connection;