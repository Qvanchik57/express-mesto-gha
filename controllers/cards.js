const DefaultError = require('../errors/defaultError');
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
const Cards = require('../models/card');

module.exports.getCards = async (req, res, next) => {
  await Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      next(new DefaultError({ messsage: 'Ошибка по умолчанию' }));
    });
};

module.exports.createCard = async (req, res, next) => {
  const {
    name,
    link,
  } = req.body;
  const owner = req.user._id;

  await Cards.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError({ messsage: 'Переданы некорректные данные при создании пользователя' });
      } else {
        next(new DefaultError({ messsage: 'Ошибка по умолчанию' }));
      }
    });
};

module.exports.deleteCardById = async (req, res, next) => {
  await Cards.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError({ messsage: 'Карточка с указанным _id не найдена' });
      } else if (card.owner.toString() === req.user._id) {
        res.send(card);
      }
    })
    .catch(next);
};

module.exports.likeCard = async (req, res, next) => {
  await Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError({ messsage: 'Передан несуществующий _id карточки' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError({ messsage: 'Переданы некорректные данные для постановки/снятии лайка' }));
      } else {
        next(new DefaultError({ messsage: 'Ошибка по умолчанию' }));
      }
    });
};

module.exports.dislikeCard = async (req, res, next) => {
  await Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError({ messsage: 'Передан несуществующий _id карточки' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError({ messsage: 'Переданы некорректные данные для постановки/снятии лайка' }));
      } else {
        next(new DefaultError({ messsage: 'Ошибка по умолчанию' }));
      }
    });
};
