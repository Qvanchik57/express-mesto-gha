const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле "name" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  link: {
    type: String,
    required: [true, 'Поле "link" должно быть заполнено'],
    validate: {
      validator: /(http(s){,1}):\/\/(www\.){,1}(a-zA-Z0-9~-\._:\/?#\[]@!$&'\(\)*\+,;=){2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9#])/,
      message: 'Некорректная ссылка',
    },
  },
  // ссылка на модель автора карточки
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле "owner" должно быть заполнено'],
    default: '658b24951c0f36e7c0b824bc',
  },
  // список лайкнувших пост пользователей
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле "likes" должно быть заполнено'],
    default: [],
  }],
  createAt: {
    type: Date,
    default: Date.now(),
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
