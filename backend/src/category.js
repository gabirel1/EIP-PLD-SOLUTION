import { database } from "../database.js";
import { v4 as uuidv4 } from "uuid";

export const createCategory = async (categoryName) => {
  // first check if category already exists
  const [rows, fields] = await database.execute(
    "SELECT * FROM categories WHERE category_name = ?",
    [categoryName]
  );
  if (rows.length > 0) {
    return { error: true, message: "Category already exists" };
  }
  const categoryUuid = uuidv4();
  const [rows2, fields2] = await database.execute(
    "INSERT INTO categories (uuid, category_name, category_current_card_number) VALUES (?, ?, ?)",
    [categoryUuid, categoryName, 0]
  );
  if (rows2.affectedRows > 0) {
    return { error: false, message: "Category created" };
  }
  return { error: true, message: "Something went wrong" };
}

export const getCategories = async () => {
  const [rows, fields] = await database.execute("SELECT * FROM categories");
  console.log('getCategories rows == ', rows);
  return rows;
}