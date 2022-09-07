import { database } from "../database.js";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";

export const login = async (username, password) => {
  const hashedPassword = CryptoJS.MD5(password).toString();
  const [rows, fields] = await database.execute(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, hashedPassword]
  );
  console.log('login res == ', rows);
  if (rows.length > 0) {
    // Create a token with the user uuid
    const token = jwt.sign({ uuid: rows[0].uuid }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    return { error: false, token: token };
  }
  return { error: true, message: "Wrong username or password" };
}