const mongoose = require('mongoose');
const { URL_PATTERN } = require('../utils/constants');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле `name` является обязательным'],
    minlength: [2, 'Минимальная длина поля `name` 2 символа'],
    maxlength: [30, 'Максимальная длина поля `name` 30 символов'],
  },
  link: {
    type: String,
    required: [true, 'Поле `link` является обязательным'],
    validate: {
      validator(value) {
        return URL_PATTERN.test(value);
      },
      message: 'Поле `link` должно быть валидным URL-адресом',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
