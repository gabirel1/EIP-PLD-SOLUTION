import mysql from "mysql2/promise";
import dotenv from 'dotenv';
dotenv.config();

export const database = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'PldHandler',
});