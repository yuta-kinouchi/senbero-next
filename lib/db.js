import mysql from 'mysql2/promise';

export async function query({ query, values = [] }) {
  const dbConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
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
