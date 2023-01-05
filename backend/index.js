import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
import { database } from './database.js';
import handlers from './src/routes.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors(
  {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }
));
app.use(bodyParser.json());


app.post('/register', handlers.registerHandler); // tested
app.post('/login', handlers.loginHandler); // tested
app.post('/category', handlers.createCategoryHandler); // tested
app.get('/category', handlers.getCategoriesHandler); // tested
app.post('/card', handlers.createCardHandler); // tested
app.get('/card', handlers.getCardsHandler); // tested
app.post('/card/assign', handlers.assignUserToCardHandler); // tested
app.delete('/card', handlers.removeCardHandler); // tested
app.put('/card', handlers.updateCardHandler); // tested
app.get('/general-informations', handlers.getGeneralInformationsHandler); // tested
app.get('/users', handlers.getUserListHandler); // tested
app.post('/export', handlers.exportPDFHandler); // tested
app.post('/card/status', handlers.updateCardStatusHandler); // tested

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});