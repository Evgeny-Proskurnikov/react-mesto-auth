import React from 'react';
import { useForm } from 'react-hook-form';
import cn from 'classnames';

function Form({ submitForm, title, btnName, setFormSubmitState, formSubmitState, children }) {
  const { register, handleSubmit, errors } = useForm({mode: 'onChange'});

  const onSubmit = data => {
    setFormSubmitState(true);
    submitForm(data);
  };

  return (
    <form name="user-form" className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className="form__title">{title}</h2>

      <input
        name="email"
        type="email"
        className={cn('form__input', { "form__input_type_error":  errors.email })}
        ref={register({
          required: {value: true, message: 'Заполните это поле'},
          minLength: {value: 5, message: 'Текст должен содержать не менее 5 симв.'},
          pattern: {value: /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/, message: 'Введите адрес электронной почты'},
        })}
        maxLength="40"
        placeholder="Email"
        autoComplete="off"
      />

      {errors.email && <span className="form__input-error">{errors.email.message}</span>}

      <input
        name="password"
        type="password"
        className={cn('form__input', { "form__input_type_error":  errors.password })}
        ref={register({
          required: {value: true, message: 'Заполните это поле'},
          minLength: {value: 8, message: 'Пароль должен содержать не менее 8 симв.'},
          pattern: {value: /^(?=.*\d)(?=.*[a-z])(?!.*\s).*$/, message: 'Должен содержать прописные латинские буквы, цифры'},
        })}
        maxLength="20"
        placeholder="Пароль"
        autoComplete="off"
      />

      {errors.password && <span className="form__input-error">{errors.password.message}</span>}

      <button
        type="submit"
        className={cn('form__save-button', { "form__save-button_inactive": (errors.email || errors.password)})}
        disabled={(errors.email || errors.password)}
      >
        {formSubmitState ? 'Загрузка...' : btnName}
      </button>

      {children}
    </form>
  );
}

export default Form;
