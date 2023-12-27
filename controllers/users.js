const Users = require('../models/user');

const VALIDATION_ERROR_CODE = 400;
const DEFAULT_ERROR_CODE = 500;
const NOTFOUND_ERROR_CODE = 404;

module.exports.getUsers = async (req, res, next) => {
  await Users.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      next(res.status(DEFAULT_ERROR_CODE).send({ messsage: 'Ошибка по умолчанию' }));
    });
};

module.exports.getUsersById = async (req, res, next) => {
  await Users.findById(req.params.userId)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(res.status(NOTFOUND_ERROR_CODE).send({ messsage: 'Пользователь по указанному _id не найден' }));
      } else {
        next(res.status(DEFAULT_ERROR_CODE).send({ messsage: 'Ошибка по умолчанию' }));
      }
    });
};

module.exports.createUser = async (req, res, next) => {
  const { name, about, avatar } = req.body;

  await Users.create({ name, about, avatar })
    .then(() => res.send({ data: name, about, avatar }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(res.status(VALIDATION_ERROR_CODE).send({ messsage: 'Переданы некорректные данные при создании пользователя' }));
      } else {
        next(res.status(DEFAULT_ERROR_CODE).send({ messsage: 'Ошибка по умолчанию' }));
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
      next(res.send(user));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOTFOUND_ERROR_CODE).send({ messsage: 'Пользователь с указанным _id не найден' });
      } else if (err.name === 'ValidationError') {
        next(res.status(VALIDATION_ERROR_CODE).send({ messsage: 'Переданы некорректные данные при обновлении профиля' }));
      } else {
        next(res.status(DEFAULT_ERROR_CODE).send({ messsage: 'Ошибка по умолчанию' }));
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
      next(res.send(user));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOTFOUND_ERROR_CODE).send({ messsage: 'Пользователь с указанным _id не найден' });
      } else if (err.name === 'ValidationError') {
        next(res.status(VALIDATION_ERROR_CODE).send({ messsage: 'Переданы некорректные данные при обновлении профиля' }));
      } else {
        next(res.status(DEFAULT_ERROR_CODE).send({ messsage: 'Ошибка по умолчанию' }));
      }
    });
};
