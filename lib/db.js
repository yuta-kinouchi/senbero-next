import mysql from 'mysql2/promise';

export async function query({ query, values = [] }) {
  const dbConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 1000,  // ここで接続の上限を設定
    queueLimit: 0
  });

  try {
    const [results] = await dbConnection.execute(query, values);
    dbConnection.end();
    return results;
  } catch (error) {
    throw Error(error.message);
    return { error };
  }
}
