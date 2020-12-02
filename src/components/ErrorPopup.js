import React from 'react';
import PopupWithForm from './PopupWithForm';

function ErrorPopup ({ isOpen, onClose, errCode }) {
  return (
    <PopupWithForm 
    title={`Что-то пошло не так... ${errCode}`}
    name='error'   
    containerClass='modal__conteiner_type_error'
    modalState={isOpen ? 'modal_opened' : ''} 
    onClose={onClose}
    />
  );
}

export default ErrorPopup;