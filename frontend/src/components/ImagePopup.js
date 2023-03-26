import React, { useEffect, useState} from 'react';

function ImagePopup({ card, onClose }) {

  const[currentCard, setCurrentCard] = useState({
    name: '',
    link: ''
  });

  function closeByClickingOverlay(evt) {
    if(evt.target === evt.currentTarget) {
      onClose();
    }
  }

  useEffect(()=> {
    if (!card) {
        setTimeout(() => {
          setCurrentCard({
            name: '',
            link: ''
          });
        }, 500);
    } else {
      setCurrentCard(card);
    }
  }, [card]);

  return (
    <div className={"popup popup_type_card" + (card && " popup_opened")} onClick={closeByClickingOverlay}>
      <div className="popup__container popup__container_type_image">
        <button className="popup__close" type="button" aria-label="Закрыть окно" title="Закрыть" onClick={onClose}></button>
        <h2 className="popup__image-title">{currentCard?.name}</h2>
        <img className="popup__image" src={currentCard?.link} alt="Название" />
      </div>
    </div>
  );
}

export default ImagePopup;