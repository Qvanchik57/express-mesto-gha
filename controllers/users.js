const DefaultError = require('../errors/defaultError');
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
const Users = require('../models/user');

module.exports.getUsers = async (req, res, next) => {
  await Users.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      next(new DefaultError({ messsage: 'Ошибка по умолчанию' }));
    });
};

module.exports.getUsersById = async (req, res, next) => {
  await Users.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError({ messsage: 'Пользователь по указанному _id не найден' });
      } else {
        res.send(user);
      }
    })
    .catch(() => {
      next(new DefaultError({ messsage: 'Ошибка по умолчанию' }));
    });
};

module.exports.createUser = async (req, res, next) => {
  const { name, about, avatar } = req.body;

  await Users.create({ name, about, avatar })
    .then(() => res.send({ data: name, about, avatar }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError({ messsage: 'Переданы некорректные данные при создании пользователя' });
      } else {
        next(new DefaultError({ messsage: 'Ошибка по умолчанию' }));
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
        throw new NotFoundError({ messsage: 'Пользователь с указанным _id не найден' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError({ messsage: 'Переданы некорректные данные при обновлении профиля' }));
      } else {
        next(new DefaultError({ messsage: 'Ошибка по умолчанию' }));
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
        throw new NotFoundError({ messsage: 'Пользователь с указанным _id не найден' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError({ messsage: 'Переданы некорректные данные при обновлении аватара' }));
      } else {
        next(new DefaultError({ messsage: 'Ошибка по умолчанию' }));
      }
    });
};
