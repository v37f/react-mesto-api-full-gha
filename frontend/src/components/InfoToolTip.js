import React from "react";

function InfoTooltip({ isOpen, onClose, data }) {

  function closeByClickingOverlay(evt) {
    if(evt.target === evt.currentTarget) {
      onClose();
    }
  }

  return (
    <div className={`popup popup_type_tooltip` + (isOpen ? " popup_opened" : "")} onClick={closeByClickingOverlay}>
      <div className="popup__container popup__container_type_tooltip">
        <button className="popup__close" type="button" aria-label="Закрыть окно" title="Закрыть" onClick={onClose}></button>
        <img className="popup__tooltip-image" src={data.image} alt="Не удалось загрузить картинку" />
        <h2 className="popup__title popup__title_type_tooltip">{data.message}</h2>
      </div>
    </div>
  )
}

export default InfoTooltip;