const Users = require('../models/user');

const VALIDATION_ERROR_CODE = 400;
const DEFAULT_ERROR_CODE = 500;
const NOTFOUND_ERROR_CODE = 404;

module.exports.getUsers = async (req, res, next) => {
  await Users.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      next(res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' }));
    });
};

module.exports.getUsersById = async (req, res, next) => {
  await Users.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALIDATION_ERROR_CODE).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      } else {
        next(res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' }));
      }
    });
};

module.exports.createUser = async (req, res, next) => {
  const { name, about, avatar } = req.body;

  await Users.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      } else {
        next(res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' }));
      }
    });
};

module.exports.patchProfile = async (req, res, next) => {
  const { name, about } = req.body;
  await Users.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      } else {
        next(res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' }));
      }
    });
};

module.exports.patchAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  await Users.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Пользователь с указанным _id не найден' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALIDATION_ERROR_CODE).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      } else {
        next(res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' }));
      }
    });
};
