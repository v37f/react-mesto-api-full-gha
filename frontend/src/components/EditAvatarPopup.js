import { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm"
import { useFormAndValidation } from "../hooks/useFormAndValidation";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {

  const [buttonText, setButtonText] = useState('Сохранить');

  const { values, handleChange, errors, isValid, resetForm, setValues } = useFormAndValidation({
    avatar: ''
  });

  useEffect(() => {
    resetForm();
    setValues({
      ...values,
      avatar: ''
    })
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    setButtonText('Сохранение...');
    onUpdateAvatar(values.avatar)
      .finally(() => {
        setButtonText('Сохранить');
      });
  } 

  return (
    <PopupWithForm title="Обновить аватар" name="update-avatar" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} isSubmitDisabled={!isValid} buttonText={buttonText}>
    <input 
      type="url" 
      id="profile-avatar-link" 
      name="avatar" 
      className="form__input form__input_type_profile-avatar-link" 
      placeholder="Ссылка на аватар" 
      required 
      value={values.avatar}
      onChange={handleChange}
    />
    <span className="profile-avatar-link-error form__input-error">{errors.avatar}</span>
  </PopupWithForm>
  )
}

export default EditAvatarPopup;