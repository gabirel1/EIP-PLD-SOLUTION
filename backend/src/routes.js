import { register } from "./register.js";
import { login } from "./login.js";
import { createCategory, getCategories } from "./category.js";
import { createCard, getCards, assignUserToCard, removeCard, updateCard } from "./cards.js";
import { getGeneralInformations, getUserList } from "./generalInformations.js";
import jwt from "jsonwebtoken";

const registerHandler = async (req, res) => {
  const { username, password } = req.body;
  const result = await register(username, password);

  if (result === false) {
    return res.status(400).json({ error: true, message: 'Username already taken' });
  }
  return res.status(201).json({ error: false, message: 'User created' });
}

const loginHandler = async (req, res) => {
  const { username, password } = req.body;
  const result = await login(username, password);

  if (result.error === true) {
    return res.status(400).json({ error: true, message: result.message });
  }
  res.send(result);
}

const createCategoryHandler = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const { categoryName } = req.body;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const result = await createCategory(categoryName);
    if (result.error === true) {
      return res.status(400).json({ error: true, message: result.message });
    }
    return res.status(201).json({ error: false, message: 'Category created' });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: true, message: 'Unauthorized' });
  }
}

const getCategoriesHandler = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const result = await getCategories();
    return res.status(200).json({ error: false, categories: result });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: true, message: 'Unauthorized' });
  }
}

const createCardHandler = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  const {
    categoryName, cardName, cardDescription,
    cardAsA, cardIWantTo, cardDefinitionOfDone,
    cardEstimatedTime, cardAssignedUserUuid = null
  } = req.body;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const result = await createCard(
      categoryName, cardName, cardDescription,
      cardAsA, cardIWantTo, cardDefinitionOfDone,
      cardEstimatedTime, cardAssignedUserUuid
    );
    if (result.error === true) {
      return res.status(400).json({ error: true, message: result.message });
    }
    return res.status(201).json({ error: false, message: 'Card created' });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: true, message: 'Unauthorized' });
  }
}

const getCardsHandler = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const result = await getCards();
    return res.status(200).json({ error: false, cards: result });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: true, message: 'Unauthorized' });
  }
}

const assignUserToCardHandler = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  const { cardUuid, userUuid } = req.body;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const result = await assignUserToCard(cardUuid, userUuid);
    if (result.error === true) {
      return res.status(400).json({ error: true, message: result.message });
    }
    return res.status(200).json({ error: false, message: 'User assigned to card' });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: true, message: 'Unauthorized' });
  }
}

const removeCardHandler = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  const { cardUuid } = req.body;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const result = await removeCard(cardUuid);
    if (result.error === true) {
      return res.status(400).json({ error: true, message: result.message });
    }
    return res.status(200).json({ error: false, message: 'Card removed' });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: true, message: 'Unauthorized' });
  }
}

const updateCardHandler = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  const {
    cardUuid, categoryName, cardName, cardDescription,
    cardAsA, cardIWantTo, cardDefinitionOfDone,
    cardEstimatedTime, cardAssignedUserUuid
  } = req.body;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const result = await updateCard(
      cardUuid, categoryName, cardName, cardDescription,
      cardAsA, cardIWantTo, cardDefinitionOfDone,
      cardEstimatedTime, cardAssignedUserUuid
    );
    if (result.error === true) {
      return res.status(400).json({ error: true, message: result.message });
    }
    return res.status(200).json({ error: false, message: 'Card updated' });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: true, message: 'Unauthorized' });
  }
}

const getGeneralInformationsHandler = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const result = await getGeneralInformations();
    return res.status(200).json({ error: false, generalInformations: result });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: true, message: 'Unauthorized' });
  }
}

const getUserListHandler = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const result = await getUserList();
    return res.status(200).json({ error: false, users: result });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: true, message: 'Unauthorized' });
  }
}

export default {
  registerHandler, loginHandler, createCategoryHandler,
  getCategoriesHandler, createCardHandler, getCardsHandler,
  assignUserToCardHandler, removeCardHandler, updateCardHandler,
  getGeneralInformationsHandler, getUserListHandler
};