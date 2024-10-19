// import mysql from 'mysql2/promise';

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   waitForConnections: true,
//   connectionLimit: 10,  // ここで接続の上限を設定
//   queueLimit: 0
// });

// export async function query({ query, values }) {
//   const connection = await pool.getConnection(); // プールから接続を取得
//   try {
//     const [results] = await connection.execute(query, values);
//     return results;
//   } finally {
//     connection.release(); // クエリ実行後に接続をプールに戻す
//   }
// }

import { createPool } from '@vercel/postgres';

const pool = createPool({
  connectionString: process.env.POSTGRES_URL,
  max: 10, // コネクションプールの最大接続数
  ssl: {
    rejectUnauthorized: false
  }
});

export async function query({ query, values = [] }) {
  const client = await pool.connect();
  try {
    const result = await client.query(query, values);
    return result.rows;
  } finally {
    client.release();
  }
}