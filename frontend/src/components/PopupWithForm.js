import React from 'react';

function PopupWithForm({ title, name, isOpen, onClose, buttonText, children, onSubmit, isSubmitDisabled }) {
  
  function closeByClickingOverlay(evt) {
    if(evt.target === evt.currentTarget) {
      onClose();
    }
  }

  return (
    <div className={`popup popup_type_${name}` + (isOpen && " popup_opened")} onClick={closeByClickingOverlay}>
      <div className="popup__container popup__container_type_form">
        <button className="popup__close" type="button" aria-label="Закрыть окно" title="Закрыть" onClick={onClose}></button>
        <h2 className="popup__title">{`${title}`}</h2>
        <form action="#" className={`form form_type_${name}`} name={`${name}-form`} noValidate onSubmit={onSubmit}>
          <fieldset className="form__info">
            {children}
            <button disabled={isSubmitDisabled} type="submit" className={"form__button form__button_type_submit" + (isSubmitDisabled && " form__button_disabled") }>{buttonText}</button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;