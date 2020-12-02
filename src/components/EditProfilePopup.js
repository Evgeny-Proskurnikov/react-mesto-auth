import React from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext'
import { FormSubmitStateContext } from '../contexts/FormSubmitStateContext';
import { useForm } from "react-hook-form";


function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const currentUser = React.useContext(CurrentUserContext);
  const formSubmitState = React.useContext(FormSubmitStateContext);

  const { register, handleSubmit, errors } = useForm({mode: 'onChange'});
  const onSubmit = data => {
    formSubmitState.setState(true);
    onUpdateUser(data);
  };

  return (
    <PopupWithForm 
      title='Редактировать профиль' 
      name='edit-profile' 
      modalState={isOpen ? 'modal_opened' : ''} 
      onClose={onClose}
      children={
      <form action="#" name="edit-profile" className="modal__form modal__form_type_profile" onSubmit={handleSubmit(onSubmit)} noValidate>
        <input 
          id="name-input" 
          name="name" 
          type="text" 
          className={errors.name ? "modal__input modal__input_type_error" : "modal__input"}
          defaultValue={currentUser.name} 
          ref={register({ 
            required: {value: true, message: 'Заполните это поле'}, 
            minLength: {value: 2, message: 'Текст должен содержать не менее 2 симв.'}, 
            maxLength: 40, 
          })}
          placeholder="Имя" 
          autoComplete="off"
        />

        <span 
          id="name-input-error" 
          className={errors.name ? "modal__input-error modal__input-error_active" : "modal__input-error"}
        >
          {isOpen ? (errors.name && errors.name.message) : errors.name = false }
        </span>

        <input 
          id="character-input" 
          name="about" 
          type="text" 
          className={errors.about ? "modal__input modal__input_type_error" : "modal__input"}
          defaultValue={currentUser.about} 
          ref={register({ 
            required: {value: true, message: 'Заполните это поле'}, 
            minLength: {value: 2, message: 'Текст должен содержать не менее 2 симв.'}, 
            maxLength: 200, 
          })}
          placeholder="Занятие"
          autoComplete="off"
        />

        <span 
          id="character-input-error" 
          className={errors.about ? "modal__input-error modal__input-error_active" : "modal__input-error"}
        >
          {isOpen ? (errors.about && errors.about.message) : errors.about = false }
        </span>

        <button 
          type="submit" 
          className={(errors.name || errors.about) ? "modal__save-button modal__save-button_inactive" : "modal__save-button"} 
          disabled={(errors.name || errors.about) && true}
        >
          {formSubmitState.state ? 'Сохранение...' : 'Сохранить'}
        </button> 
      </form>
    }/>
  );
}

export default EditProfilePopup;
