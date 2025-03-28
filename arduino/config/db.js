//db.js
// This file is responsible for creating a connection to the database
import mysql from 'mysql2';
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'Robotics',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
export default pool.promise();