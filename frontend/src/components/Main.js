import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Card from './Card';

function Main({ onEditProfile, onAddPlace, onEditAvatar, onCardClick, onCardLike, onCardDelete, cards }) { 

  const currentUser = useContext(CurrentUserContext);

  return (
    <main className="content">

      {/* начало блока profile */}
      <section className="profile">
        <div className="profile__container">
          <div className="profile__avatar" onClick={onEditAvatar}>
            <img className="profile__avatar-image" src={currentUser?.avatar} alt="Аватар" />
            <div className="profile__avatar-cover"></div>
          </div>
          <div className="profile__info">
            <h1 className="profile__name">{currentUser?.name}</h1>
            <button 
              className="profile__edit-button" 
              onClick={onEditProfile} 
              type="button" 
              aria-label="редактирование профиля" 
              title="Редактировать профиль">
            </button>
            <p className="profile__job">{currentUser?.about}</p>
          </div>
          <button 
            className="profile__card-add-button" 
            onClick={onAddPlace} 
            type="button" 
            aria-label="добавление места" 
            title="Добавить место">
          </button>
        </div>
      </section>
      {/* конец блока profile */}

      {/* начало блока cards */}
      <section className="cards" aria-label="Карточки мест">
        <ul className="cards__container">
          {cards.map(card => (
            <Card card={card} onCardClick={onCardClick} onCardLike={onCardLike} onCardDelete={onCardDelete} key={card._id} />
          )).reverse()}
        </ul>
      </section>
      {/* конец блока cards */}
    </main>
  );
}

export default Main;