const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/notFoundError');
const { authValidation, regValidation } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('connected'))
  .catch((err) => console.log(`Произошло ошибка ${err.name}: ${err.message}`));

app.use('/signin', authValidation, login);
app.use('/signup', regValidation, createUser);

app.use('/', auth, usersRouter);
app.use('/', auth, cardsRouter);
app.use('/', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode, message } = err;
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT);
