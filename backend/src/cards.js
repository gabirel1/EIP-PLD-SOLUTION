import { database } from "../database.js";
import { v4 as uuidv4 } from "uuid";

export const createCard = async (
  categoryName, cardName, cardDescription, cardAsA, cardIWantTo,
  cardDefinitionOfDone, cardEstimatedTime, cardAssignedUserUuid = null
) => {
  // retrieve category_current_card_number from the corresponding category
  const [rows, fields] = await database.execute(
    "SELECT category_current_card_number FROM categories WHERE category_name = ?",
    [categoryName]
  );
  if (rows.length === 0) {
    return { error: true, message: "Category does not exist" };
  }
  const cardNumber = rows[0].category_current_card_number + 1;
  
  const cardUuid = uuidv4();
  const [rows2, fields2] = await database.execute(
    "INSERT INTO cards (uuid, category_name, card_name, card_number, card_description, card_as_a, card_i_want_to, card_definition_of_done, card_estimated_time, card_assigned_user_uuid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      cardUuid, categoryName, cardName, cardNumber, cardDescription, cardAsA,
      cardIWantTo, cardDefinitionOfDone, cardEstimatedTime, cardAssignedUserUuid
    ]
  );
  if (rows2.affectedRows > 0) {
    // update category_current_card_number
    const [rows3, fields3] = await database.execute(
      "UPDATE categories SET category_current_card_number = ? WHERE category_name = ?",
      [cardNumber, categoryName]
    );
    if (rows3.affectedRows > 0) {
      return { error: false, message: "Card created" };
    }
    return { error: false, message: "Card created" }; // maybe return error here?
  }
  return { error: true, message: "Something went wrong" };
}

export const getCards = async () => {
  const [rows, fields] = await database.execute(
    "SELECT * FROM cards",
  );
  return rows;
}

export const assignUserToCard = async (cardUuid, userUuid) => {
  const [rows, fields] = await database.execute(
    "UPDATE cards SET card_assigned_user_uuid = ? WHERE uuid = ?",
    [userUuid, cardUuid]
  );
  if (rows.affectedRows > 0) {
    return { error: false, message: "User assigned to card" };
  }
  return { error: true, message: "Something went wrong" };
}

export const removeCard = async (cardUuid) => {
  const [rows, fields] = await database.execute(
    "DELETE FROM cards WHERE uuid = ?",
    [cardUuid]
  );
  if (rows.affectedRows > 0) {
    return { error: false, message: "Card removed" };
  }
  return { error: true, message: "Something went wrong" };
}

export const updateCard = async (
  cardUuid, categoryName, cardName, cardDescription, cardAsA, cardIWantTo,
  cardDefinitionOfDone, cardEstimatedTime, cardAssignedUserUuid = undefined
) => {
  const [rows, fields] = await database.execute(
    "UPDATE cards SET category_name = ?, card_name = ?, card_description = ?, card_as_a = ?, card_i_want_to = ?, card_definition_of_done = ?, card_estimated_time = ?, card_assigned_user_uuid = ? WHERE uuid = ?",
    [
      categoryName, cardName, cardDescription, cardAsA, cardIWantTo, cardDefinitionOfDone,
      cardEstimatedTime, cardAssignedUserUuid, cardUuid
    ]
  );
  if (rows.affectedRows > 0) {
    return { error: false, message: "Card updated" };
  }
  return { error: true, message: "Something went wrong" };
}

// card status: 0 - not started, 1 - in progress, 2 - done
export const updateCardStatus = async (cardUuid, cardStatus) => {
  const [rows, fields] = await database.execute(
    "UPDATE cards SET card_status = ? WHERE uuid = ?",
    [cardStatus, cardUuid]
  );
  if (rows.affectedRows > 0) {
    return { error: false, message: "Card status updated" };
  }
  return { error: true, message: "Something went wrong" };
}