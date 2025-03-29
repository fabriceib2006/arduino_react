import mysql from 'mysql2/promise'; // Add missing import

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'Robotics',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}).on('error', (err) => {
  console.error('Database error:', err);
});

export default pool; // Ensure the pool is exported