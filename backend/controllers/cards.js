const { Error } = require('mongoose');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

const Card = require('../models/card');

// GET /cards
module.exports.getCards = (_req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

// POST /cards
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => card.populate('owner'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new BadRequestError(err.errors[Object.keys(err.errors)[0]].message));
        return;
      }
      next(err);
    });
};

// DELETE /cards/:cardId
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
      return Card.deleteOne(card)
        .then(() => res.send({ message: 'Пост удалён' }));
    })
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequestError(
          'ID карточки должен содержать только латинские буквы[a-f] и цифры, а также иметь длину 24 символа',
        ));
        return;
      }
      next(err);
    });
};

function handleCardLike(req, res, next, handler) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    handler,
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequestError(
          'ID карточки должен содержать только латинские буквы[a-f] и цифры, а также иметь длину 24 символа',
        ));
        return;
      }
      next(err);
    });
}

// PUT /cards/:cardId/likes
module.exports.likeCard = (req, res, next) => handleCardLike(req, res, next, {
  $addToSet: { likes: req.user._id },
});

// DELETE /cards/:cardId/likes
module.exports.dislikeCard = (req, res, next) => handleCardLike(req, res, next, {
  $pull: { likes: req.user._id },
});
