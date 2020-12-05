import React from 'react';

function PopupWithForm({ 
  name, 
  modalState, 
  title, 
  containerClass, 
  onClose, 
  children, 
  infoToolTipImageSuccess, 
  infoToolTipImageDeny 
}) {
  function handleClose(evt) {
    if (evt.target.classList.contains('modal')) {
      onClose();
    }
  }

  return (
    <div className={`modal modal_type_${name} ${modalState}`} onClick={handleClose}>
      <div className={`modal__container ${containerClass}`}>
        <button type="button" className="modal__close-button" onClick={onClose}></button>
        {infoToolTipImageSuccess && <div className='modal__info-image_success'/>}
        {infoToolTipImageDeny && <div className='modal__info-image_deny'/>}
        <h3 className="modal__title">{title}</h3>
        {children}
      </div>
    </div>
  );
}

export default PopupWithForm;
