import mysql from 'mysql2/promise';
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'Robotics',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection()
  .then(() => {
    console.log('Database connected successfully');
    return pool.query('SELECT 1'); // Test query to ensure the database is operational
  })
  .then(() => console.log('Database test query executed successfully'))
  .catch((err) => console.error('Database connection failed:', err.message));

export default pool;