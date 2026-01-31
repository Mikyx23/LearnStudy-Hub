import mysql2 from 'mysql2/promise';

export const pool = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mikyxDev23&',
    database: 'db_learnstudy',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});