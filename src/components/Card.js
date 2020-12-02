import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext'

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext);

  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = card.owner._id === currentUser._id;
  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = card.likes.some(i => i._id === currentUser._id);

  const cardLikeButtonClassName = `${isLiked ? 'card__like-button card__like-button_status_active' : 'card__like-button'}`; 

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <div className="card">
      {isOwn && <button type="button" className="card__delete-button" onClick={handleDeleteClick}/>}
      <img src={card ? card.link : ''} alt={card ? card.name : ''} className="card__image" onClick={handleClick}/>
      <div className="card__conteiner">
        <h2 className="card__title">{card ? card.name : ''}</h2>
        <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}>
          <span className="card__like-counter">{card && (card.likes.length > 0) ? card.likes.length : null}</span>
        </button>
      </div>
    </div>
  );
}

export default Card;