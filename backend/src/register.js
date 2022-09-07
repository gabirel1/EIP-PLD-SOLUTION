import { database } from "../database.js";
import cryptoJs from "crypto-js";
import {v4 as uuidv4} from 'uuid';

export const register = async (username, password) => {
  // First check if the username is already taken if so return false
  const [rows, fields] = await database.execute(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );
  console.log('rows', rows);
  if (rows.length > 0) {
    return false;
  }
  // If the username is not taken insert the user into the database
  const hashedPassword = cryptoJs.MD5(password).toString();
  const userUuid = uuidv4();
  const [rows2, fields2] = await database.execute(
    "INSERT INTO users (uuid, username, password) VALUES (?, ?, ?)",
    [userUuid, username, hashedPassword]
  );
  console.log('register user res == ', rows2, fields2);
  if (rows2.affectedRows > 0) {
    return true;
  }
  return false;
}