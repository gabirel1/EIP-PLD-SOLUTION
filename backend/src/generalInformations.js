import { database } from "../database.js";

const getUsers = async () => {
  const [rows, fields] = await database.execute("SELECT uuid, username FROM users");
  return rows;
}

const getTotalNumberOfTime = async () => {
  const [rows, fields] = await database.execute("SELECT SUM(card_estimated_time) AS total_time FROM cards");
  return rows[0].total_time;
}

const getTotalTimePerUser = async (users) => {
  const usersTime = [];
  for (let i = 0; i < users.length; i++) {
    const [rows, fields] = await database.execute("SELECT SUM(card_estimated_time) AS total_time FROM cards WHERE card_assigned_user_uuid = ?", [users[i].uuid]);
    usersTime.push({ user: users[i], time: rows[0].total_time });
  }
  return usersTime;
}

const getTotalDoneCardsTimePerUser = async (users) => {
  const usersTime = [];
  for (let i = 0; i < users.length; i++) {
    const [rows, fields] = await database.execute("SELECT SUM(card_estimated_time) AS total_time FROM cards WHERE card_assigned_user_uuid = ? AND card_status = 2", [users[i].uuid]);
    usersTime.push({ user: users[i], time: rows[0].total_time });
  }
  return usersTime;
}

const getCategories = async () => {
  const [rows, fields] = await database.execute("SELECT * FROM categories");
  return rows;
}

export const getGeneralInformations = async () => {
  const users = await getUsers();
  const totalNumberOfTime = await getTotalNumberOfTime();
  const totalTimePerUser = await getTotalTimePerUser(users);
  const categories = await getCategories();
  const totalDoneCardsTimePerUser = await getTotalDoneCardsTimePerUser(users);
  return { users: users, totalNumberOfTime: totalNumberOfTime, totalTimePerUser: totalTimePerUser, categories: categories, totalTimeDonePerUser: totalDoneCardsTimePerUser };
}

export const getUserList = async () => {
  const users = await getUsers();
  return users;
}