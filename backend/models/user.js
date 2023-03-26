const mongoose = require('mongoose');
const validator = require('validator');
const { URL_PATTERN } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Поле `email` является обязательным'],
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: 'Поле `email` должно быть валидным email-адресом',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле `password` является обязательным'],
    select: false,
  },
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля `name` 2 символа'],
    maxlength: [30, 'Максимальная длина поля `name` 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля `about` 2 символа'],
    maxlength: [30, 'Максимальная длина поля `about` 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(value) {
        return URL_PATTERN.test(value);
      },
      message: 'Поле `avatar` должно быть валидным URL-адресом',
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
