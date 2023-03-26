import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card({ card, onCardClick, onCardLike, onCardDelete }) {

  const currentUser = useContext(CurrentUserContext);

  const isOwn = card.owner._id === currentUser._id;

  const isLiked = card.likes.some(i => i._id === currentUser._id);

  const cardLikeButtonClassName = ( 
    `card__like-button ${isLiked && 'card__like-button_active'}` 
  );

  function handleCardClick() {
    onCardClick(card)
  } 

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <li className="card">
      {isOwn && <button className="card__delete-button" type="button" aria-label="удалить" title="Удалить" onClick={handleDeleteClick} />}
      <img className="card__image" src={card.link} alt="Не удалось загрузить картинку!" onClick={handleCardClick} />
      <div className="card__bottom-box">
        <h2 className="card__title">{card.name}</h2>
        <div className="card__like-box">
          <button className={cardLikeButtonClassName} type="button" aria-label="Мне нравится!" onClick={handleLikeClick}></button>
          <p className="card__like-counter">{card.likes.length}</p>
        </div>
      </div>
    </li>
  );
}

export default Card;