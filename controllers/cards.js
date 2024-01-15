const Cards = require('../models/card');
const ValidationError = require('../errors/validationError');
const NotFoundError = require('../errors/notFoundError');
const ForeignError = require('../errors/foreignError');

const GOOD_REQ = 200;
const CREATE_REQ = 201;

module.exports.getCards = async (req, res, next) => {
  await Cards.find({})
    .then((cards) => res.status(GOOD_REQ).send({ data: cards }))
    .catch(next);
};

module.exports.createCard = async (req, res, next) => {
  const {
    name,
    link,
  } = req.body;
  const owner = req.user._id;

  await Cards.create({ name, link, owner })
    .then((card) => res.status(CREATE_REQ).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCardById = async (req, res, next) => {
  await Cards.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      if (card.owner.toString() === req.user._id) {
        res.status(GOOD_REQ).send(card);
      } else {
        next(new ForeignError('Удаление чужой карточки невозможно'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные при удалении карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = async (req, res, next) => {
  await Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      res.status(GOOD_REQ).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные для постановки/снятии лайка'));
      } else {
        next(err);
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
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      next(res.send({ data: card }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные для постановки/снятии лайка'));
      } else {
        next(err);
      }
    });
};
