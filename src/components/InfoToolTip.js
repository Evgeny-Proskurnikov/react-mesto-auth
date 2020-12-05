import React from 'react';
import PopupWithForm from './PopupWithForm';

function InfoToolTip({ isOpen, onClose, requestState }) {
  return (
    <PopupWithForm 
      title={requestState ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}
      name='info'   
      modalState={isOpen ? 'modal_opened' : ''} 
      onClose={onClose}
      infoToolTipImageSuccess={requestState && true}
      infoToolTipImageDeny={!requestState && true}
    />
  );
}

export default InfoToolTip;
