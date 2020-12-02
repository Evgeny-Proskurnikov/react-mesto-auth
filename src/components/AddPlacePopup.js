import React from 'react';
import PopupWithForm from './PopupWithForm';
import { FormSubmitStateContext } from '../contexts/FormSubmitStateContext';
import { useForm } from "react-hook-form";


function AddPlacePopup ({ isOpen, onClose, onAddPlace }) {
  const [name, setName] = React.useState('');
  const [link, setLink] = React.useState('');
  const formSubmitState = React.useContext(FormSubmitStateContext);
  const { register, handleSubmit, errors } = useForm({mode: 'onSubmit'});

  function handleNameChange(evt) {
    setName(evt.target.value)
  }

  function handleLinkChange(evt) {
    setLink(evt.target.value)
  }

  function onSubmit() {
    formSubmitState.setState(true);

    onAddPlace({
      name: name,
      link: link,
    });
  }

  return (
    <PopupWithForm 
      title='Новое место'  
      name='add-card' 
      modalState={isOpen ? 'modal_opened' : ''} 
      onClose={onClose}
      children={
      <form action="#" name="add-card" className="modal__form modal__form_type_addcard" onSubmit={handleSubmit(onSubmit)} noValidate>
        <input 
          id="place-input" 
          name="name" type="text" 
          className={errors.name ? "modal__input modal__input_type_error" : "modal__input"}
          defaultValue={name} 
          onChange={handleNameChange} 
          placeholder="Название" 
          ref={register({ 
            required: {value: true, message: 'Заполните это поле'}, 
            minLength: {value: 1, message: 'Текст должен содержать не менее 1 симв.'}, 
            maxLength: 30, 
          })}
          autoComplete="off"
        />

        <span 
          id="place-input-error" 
          className={errors.name ? "modal__input-error modal__input-error_active" : "modal__input-error"}
        >
          {isOpen ? (errors.name && errors.name.message) : errors.name = false}
        </span>

        <input 
          id="url-input" 
          name="link" 
          type="url" 
          className={errors.link ? "modal__input modal__input_type_error" : "modal__input"}
          defaultValue={link} 
          onChange={handleLinkChange} 
          placeholder="Ссылка на картинку" 
          ref={register({ 
            required: {value: true, message: 'Заполните это поле'}, 
            minLength: {value: 2, message: 'Текст должен содержать не менее 2 симв.'}, 
            maxLength: 200,
            validate: {isUrl: value => value.includes('https://') === true || 'Введите URL'},
          })}
          autoComplete="off"
        />

        <span 
          id="url-input-error" 
          className={errors.link ? "modal__input-error modal__input-error_active" : "modal__input-error"}
        >
          {isOpen ? (errors.link && errors.link.message) : errors.link = false}
        </span>
        
        <button 
          type="submit" 
          className={(errors.name || errors.link) ? "modal__save-button modal__save-button_inactive" : "modal__save-button"} 
          disabled={(errors.name || errors.link) && true}
        >
          {formSubmitState.state ? 'Сохранение...' : 'Создать'}
        </button>
      </form>
    }/>
  );
}

export default AddPlacePopup;