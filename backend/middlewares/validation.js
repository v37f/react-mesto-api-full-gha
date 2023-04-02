const { celebrate, Joi } = require('celebrate');
const { URL_PATTERN } = require('../utils/constants');

module.exports.validateAuthInfo = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .messages({
        'string.empty': 'Поле `email` должно быть заполнено',
        'string.email': 'Поле `email` должно содержать валидный email-адрес',
        'any.required': 'Поле `email` является обязательным',
      }),
    password: Joi.string()
      .required()
      .min(8)
      .messages({
        'string.empty': 'Поле `password` должно быть заполнено',
        'string.min': 'Поле `password` должно содержать минимум {#limit} символов',
        'any.required': 'Поле `password` является обязательным',
      }),
    name: Joi.string()
      .min(2)
      .max(30)
      .messages({
        'string.min': 'Поле `name` должно содержать минимум {#limit} символа',
        'string.max': 'Поле `name` должно содержать максимум {#limit} символов',
      }),
    about: Joi.string()
      .min(2)
      .max(30)
      .messages({
        'string.min': 'Поле `about` должно содержать минимум {#limit} символа',
        'string.max': 'Поле `about` должно содержать максимум {#limit} символов',
      }),
    avatar: Joi.string()
      .pattern(URL_PATTERN)
      .messages({
        'string.pattern.base': 'Поле `avatar` должно содержать валидный URL-адрес',
      }),
  }),
});

module.exports.validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(30)
      .messages({
        'string.min': 'Поле `name` должно содержать минимум {#limit} символа',
        'string.max': 'Поле `name` должно содержать максимум {#limit} символов',
      }),
    about: Joi.string()
      .min(2)
      .max(30)
      .messages({
        'string.min': 'Поле `about` должно содержать минимум {#limit} символа',
        'string.max': 'Поле `about` должно содержать максимум {#limit} символов',
      }),
    avatar: Joi.string()
      .pattern(URL_PATTERN)
      .messages({
        'string.pattern.base': 'Поле `avatar` должно содержать валидный URL-адрес',
      }),
  }),
});

module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string()
      .hex()
      .length(24)
      .messages({
        'string.hex': 'ID карточки может содержать только латинские буквы[a-f] и цифры',
        'string.length': 'Длина ID пользователя должна составлять {#limit} символа',
      }),
  }),
});

module.exports.validateCardInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(30)
      .required()
      .messages({
        'string.min': 'Поле `name` должно содержать минимум {#limit} символа',
        'string.max': 'Поле `name` должно содержать максимум {#limit} символов',
        'any.required': 'Поле `name` является обязательным',
      }),
    link: Joi.string()
      .pattern(URL_PATTERN)
      .required()
      .messages({
        'string.pattern.base': 'Поле `link` должно содержать валидный URL-адрес',
        'any.required': 'Поле `link` является обязательным',
      }),
  }),
});

module.exports.validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string()
      .hex()
      .length(24)
      .messages({
        'string.hex': 'ID карточки может содержать только латинские буквы[a-f] и цифры',
        'string.length': 'Длина ID карточки должна составлять {#limit} символа',
      }),
  }),
});
