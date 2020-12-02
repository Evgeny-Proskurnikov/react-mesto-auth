import React from 'react';

function ImagePopup({ card, modalState, onClose }) {

  function handleClose(evt) {
    if (evt.target.classList.contains('modal')) {
      onClose();
    }
  }

  return (
    <div className={`modal modal_type_photo ${modalState}`} onClick={handleClose}>
      <div className="modal__container modal__conteiner_type_photo">
        <button type="button" className="modal__close-button" onClick={onClose}></button>
        <img src={card.link ? card.link : null} alt={card.name ? card.name : null} className="modal__image"/>
        <h3 className="modal__title modal__title_type_photo">{card.name ? card.name : null}</h3>
      </div>
    </div>
  );
}

export default ImagePopup;