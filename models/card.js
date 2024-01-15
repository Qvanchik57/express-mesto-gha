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

cardSchema.path('link').validate((val) => {
  const urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  return urlRegex.test(val);
}, 'Invalid URL.');

module.exports = mongoose.model('card', cardSchema);
