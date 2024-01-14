const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { cardValidation, cardIdValidation } = require('../middlewares/validation');

router.get('/cards', getCards);

router.post('/cards', cardValidation, createCard);

router.delete('/cards/:cardId', cardIdValidation, deleteCardById);

router.put('/cards/:cardId/likes', cardIdValidation, likeCard);

router.delete('/cards/:cardId/likes', cardIdValidation, dislikeCard);

module.exports = router;
