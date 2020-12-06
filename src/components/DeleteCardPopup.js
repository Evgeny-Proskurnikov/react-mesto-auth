import React from 'react';
import PopupWithForm from './PopupWithForm';
import { FormSubmitStateContext } from '../contexts/FormSubmitStateContext';

function DeleteCardPopup ({ card, isOpen, onClose, onCardDelete }) {
  const formSubmitState = React.useContext(FormSubmitStateContext);

  function handleClick() {
    onCardDelete(card)
    formSubmitState.setState(true);
  }

  return (
    <PopupWithForm 
    title='Вы уверены?' 
    name='del-card'
    modalState={isOpen ? 'modal_opened' : ''} 
    onClose={onClose}
    children={
      <button type="button" className="modal__confirm-button" onClick={handleClick}>
        {formSubmitState.state ? 'Удаление...' : 'Да'}
      </button>
    }/>
  );
}

export default DeleteCardPopup;
