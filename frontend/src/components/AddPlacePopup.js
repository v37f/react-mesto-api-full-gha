import { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm"
import { useFormAndValidation } from "../hooks/useFormAndValidation";

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {

  const [buttonText, setButtonText] = useState('Создать');
  const { values, handleChange, errors, isValid, resetForm, setValues } = useFormAndValidation({
    cardTitle: '',
    imageLink: ''
  });

  useEffect(() => {
    resetForm();
    setValues({
      ...values,
      cardTitle: '',
      imageLink: ''
    }); 
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    setButtonText('Создание...');
    onAddPlace({ name: values.cardTitle, link: values.imageLink })
      .finally(() => {
        setButtonText('Создать');
      });
  } 

  return (
      <PopupWithForm title="Новое место" name="add-card" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} isSubmitDisabled={!isValid} buttonText={buttonText}>
      <input 
        type="text" 
        id="card-title" 
        name="cardTitle" 
        className="form__input form__input_type_card-title" 
        placeholder="Название" 
        minLength="2" 
        maxLength="30" 
        required 
        onChange={handleChange}
        value={values.cardTitle}
      />
      <span className="card-title-error form__input-error">{errors.cardTitle}</span>
      <input 
        type="url" 
        id="card-image-link" 
        name="imageLink" 
        className="form__input form__input_type_card-image-link" 
        placeholder="Ссылка на картинку" 
        required 
        onChange={handleChange}
        value={values.imageLink}
      />
      <span className="card-image-link-error form__input-error">{errors.imageLink}</span>
    </PopupWithForm>
  )
}

export default AddPlacePopup;