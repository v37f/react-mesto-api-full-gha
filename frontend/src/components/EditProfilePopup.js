import { useState, useEffect, useContext } from "react";
import PopupWithForm from "./PopupWithForm"
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { useFormAndValidation } from "../hooks/useFormAndValidation";

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const currentUser = useContext(CurrentUserContext);
  const [buttonText, setButtonText] = useState('Сохранить');
  const { values, handleChange, errors, isValid, resetForm, setValues, setIsValid } = useFormAndValidation({
    userName: '',
    userJob: ''
  });

  useEffect(() => {
    resetForm();
    setValues({
      ...values,
      userName: currentUser.name,
      userJob: currentUser.about
    });
    setIsValid(true);
  }, [currentUser, isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    setButtonText('Сохранение...');
    onUpdateUser({
      name: values.userName,
      about: values.userJob
    })
      .finally(() => {
        setButtonText('Сохранить');
      });
  }

  return (
    <PopupWithForm title="Редактировать профиль" name="edit-profile" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} isSubmitDisabled={!isValid} buttonText={buttonText}>      
      <input 
        type="text" 
        id="profile-name" 
        name="userName" 
        className="form__input form__input_type_profile-name" 
        placeholder="Имя" 
        minLength="2" 
        maxLength="40" 
        required 
        value={values.userName}
        onChange={handleChange}
      />
      <span className="profile-name-error form__input-error">{errors.userName}</span>
      <input 
        type="text" 
        id="profile-job" 
        name="userJob" 
        className="form__input form__input_type_profile-job" 
        placeholder="О себе" 
        minLength="2" 
        maxLength="200" 
        required 
        value={values.userJob}
        onChange={handleChange}
      />
      <span className="profile-job-error form__input-error">{errors.userJob}</span>
    </PopupWithForm>
  )
}

export default EditProfilePopup;