import React from 'react';
import PopupWithForm from './PopupWithForm';
import { FormSubmitStateContext } from '../contexts/FormSubmitStateContext';
import { useForm } from "react-hook-form";


function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const formSubmitState = React.useContext(FormSubmitStateContext);
  const { register, handleSubmit, errors } = useForm({mode: 'onSubmit'});
 
  function onSubmit(data) {
    formSubmitState.setState(true);
    onUpdateAvatar(data);
  }

  return (
    <PopupWithForm 
      title='Обновить аватар' 
      name='edit-avatar' 
      modalState={isOpen ? 'modal_opened' : ''} 
      onClose={onClose}
      children={
        <form action="#" name="edit-avatar" className="modal__form modal__form_type_avatar" onSubmit={handleSubmit(onSubmit)} noValidate>
          <input 
            id="url-input" 
            name="avatar" 
            type="url" 
            className={errors.avatar ? "modal__input modal__input_type_error" : "modal__input"}
            ref={
              register({ 
                required: {value: true, message: 'Заполните это поле'}, 
                validate: {isUrl: value => value.includes('https://') === true || 'Введите URL'},
                maxLength: 200,  
              })
            } 
            placeholder="Ссылка на аватар" 
            autoComplete="off"
          />

          <span 
            id="url-input-error" 
            className={errors.avatar ? "modal__input-error modal__input-error_active" : "modal__input-error"}
          >
            {isOpen ? (errors.avatar && errors.avatar.message) : errors.avatar = false}
          </span>
          
          <button 
            type="submit" 
            className={errors.avatar ? "modal__save-button modal__save-button_inactive" : "modal__save-button"} 
            disabled={errors.avatar && true}
          >
            {formSubmitState.state ? 'Сохранение...' : 'Сохранить'}
          </button>
        </form>
      }
    />
  );
}

export default EditAvatarPopup;
