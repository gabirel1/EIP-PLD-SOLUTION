import { register } from "./register.js";
import { login } from "./login.js";
import { createCategory, getCategories } from "./category.js";
import { createCard, getCards, assignUserToCard, removeCard, updateCard, updateCardStatus } from "./cards.js";
import { getGeneralInformations, getUserList } from "./generalInformations.js";
import { exportPDF } from "./pdf.js";
import jwt from "jsonwebtoken";
import path from 'path';

const registerHandler = async (req, res) => {
  const { username, password, secret } = req.body;
  const result = await register(username, password, secret);

  if (result.success === false && result.message === 'Username already taken') {
    return res.status(400).json({ error: true, message: 'Username already taken' });
  } else if (result.success === false && result.message === 'Secret key is not correct') {
    return res.status(400).json({ error: true, message: 'Secret key is not correct' });
  }
  return res.status(201).json({ error: false, message: 'User created' });
}

const loginHandler = async (req, res) => {
  const { username, password } = req.body;
  console.log('username', username);
  console.log('password', password);
  const result = await login(username, password);

  if (result.error === true) {
    return res.status(400).json({ error: true, message: result.message });
  }
  res.send(result);
}

const createCategoryHandler = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
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
  const token = req.headers.authorization?.split(' ')[1];

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
  const token = req.headers.authorization?.split(' ')[1];

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
  const token = req.headers.authorization?.split(' ')[1];

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
  const token = req.headers.authorization?.split(' ')[1];

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

const updateCardStatusHandler = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  const { cardUuid, status = '0' } = req.body;
  
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const result = await updateCardStatus(cardUuid, status);
    if (result.error === true) {
      return res.status(400).json({ error: true, message: result.message });
    }
    return res.status(200).json({ error: false, message: 'Card status updated' });
  } catch (error) {
    console.log('req.body', req.body);
    console.log(error);
    return res.status(401).json({ error: true, message: 'Unauthorized' });
  }
}

const removeCardHandler = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  const { cardUuid } = req.body;
  console.log('cardUuid', cardUuid);

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
  const token = req.headers.authorization?.split(' ')[1];

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
  const token = req.headers.authorization?.split(' ')[1];

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
  const token = req.headers.authorization?.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const result = await getUserList();
    return res.status(200).json({ error: false, users: result });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: true, message: 'Unauthorized' });
  }
}

const exportPDFHandler = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  const { projectName, sprintNumber, sprintPhase } = req.body;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const result = await exportPDF(projectName, sprintNumber, sprintPhase);

    if (result.error === true) {
      return res.status(400).json({ error: true, message: result.message });
    }
    const filePath = './test.pdf';
    return res.download(filePath, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('File downloaded');
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: true, message: 'Unauthorized' });
  }
}

export default {
  registerHandler, loginHandler, createCategoryHandler,
  getCategoriesHandler, createCardHandler, getCardsHandler,
  assignUserToCardHandler, removeCardHandler, updateCardHandler,
  getGeneralInformationsHandler, getUserListHandler, exportPDFHandler,
  updateCardStatusHandler
};