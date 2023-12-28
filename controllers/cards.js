const Cards = require('../models/card');

const VALIDATION_ERROR_CODE = 400;
const DEFAULT_ERROR_CODE = 500;
const NOTFOUND_ERROR_CODE = 404;

module.exports.getCards = async (req, res, next) => {
  await Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      next(res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' }));
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
        next(res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' }));
      } else {
        next(res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' }));
      }
    });
};

module.exports.deleteCardById = async (req, res, next) => {
  await Cards.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' }));
      } else if (err.name === 'CastError') {
        next(res.status(NOTFOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' }));
      } else {
        next(res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' }));
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
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
      } else if (err.name === 'ValidationError') {
        next(res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' }));
      } else {
        next(res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' }));
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
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
      } else if (err.name === 'ValidationError') {
        next(res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' }));
      } else {
        next(res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' }));
      }
    });
};
