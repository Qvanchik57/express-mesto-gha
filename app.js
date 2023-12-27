const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(cors());

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('connected'))
  .catch((err) => console.log(`Произошло ошибка ${err.name}: ${err.message}`));

app.use((req, res, next) => {
  req.user = {
    _id: '658b24951c0f36e7c0b824bc',
  };

  next();
});
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.listen(PORT);
