import React from 'react';
import { useFormAndValidation } from '../hooks/useFormAndValidation';

function Login({ handleLogin }) {
  const { values, handleChange, errors, isValid, resetForm } = useFormAndValidation({
    email: '',
    password: ''
  });

  function handleSubmit(evt) {
    evt.preventDefault();
    handleLogin(values.password, values.email)
    .then(() => {
      resetForm();
    })
  }

  return (
    <div className="register">
      <div className="register__container">
        <h2 className="register__title">Вход</h2>
        <form action="#" className="form form_type_register" name="login-form" noValidate onSubmit={handleSubmit}>
          <fieldset className="form__info">
            <input 
              type="email" 
              id="email" 
              name="email" 
              className="form__input form__input_type_register" 
              placeholder="Email" 
              minLength="2" 
              maxLength="40" 
              required 
              value={values.email || ''}
              onChange={handleChange}
            />
            <span className="form__input-error form__input-error_type_register">{errors.email}</span>
            <input 
              type="password" 
              id="password" 
              name="password" 
              className="form__input form__input_type_register"
              placeholder="Пароль" 
              minLength="2" 
              maxLength="30" 
              required 
              value={values.password || ''}
              onChange={handleChange}
            />
            <span className="form__input-error form__input-error_type_register">{errors.password}</span>
            <button disabled={!isValid} type="submit" className={"form__button form__button_type_register"}>Войти</button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default Login;