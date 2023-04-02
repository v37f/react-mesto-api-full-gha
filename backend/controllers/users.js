const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const { Error } = require('mongoose');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-error');
const { JWT_SECRET } = require('../config');
const { removePassword } = require('../utils/utils');
const User = require('../models/user');

// GET /users
module.exports.getUsers = (_req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

function getUser(res, next, userId) {
  return User.findById(userId)
    .orFail(() => { throw new NotFoundError('Пользователь не найден'); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequestError(
          'ID пользователя должен содержать только латинские буквы[a-f] и цифры, а также иметь длину 24 символа',
        ));
        return;
      }
      next(err);
    });
}
// GET /users/me
module.exports.getCurrentUser = (req, res, next) => getUser(res, next, req.user._id);

// GET /users/:userId
module.exports.getUserById = (req, res, next) => getUser(res, next, req.params.userId);

// POST /signup
module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((passwordHash) => User.create({
      email,
      password: passwordHash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      res.status(201).send(removePassword(user));
    })
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new BadRequestError(err.errors[Object.keys(err.errors)[0]].message));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
        return;
      }
      next(err);
    });
};

// POST /signin
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User
    .findOne({ email }).select('+password')
    .orFail(() => { throw new UnauthorizedError('Неправильная почта или пароль'); })
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (matched) {
        return user;
      }
      throw new UnauthorizedError('Неправильная почта или пароль');
    }))
    .then((user) => {
      const jwt = jsonwebtoken.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ user: removePassword(user), token: jwt });
    })
    .catch(next);
};

function updateUserInfo(req, res, next, data) {
  return User.findByIdAndUpdate(
    req.user._id,
    data,
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new BadRequestError(err.errors[Object.keys(err.errors)[0]].message));
        return;
      }
      next(err);
    });
}

// PATCH /users/me
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  updateUserInfo(req, res, next, { name, about });
};

// PATCH /users/me/avatar
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  updateUserInfo(req, res, next, { avatar });
};
