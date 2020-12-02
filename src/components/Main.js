import React from 'react';
import Card from './Card'
import { CurrentUserContext } from '../contexts/CurrentUserContext'

function Main({ onEditProfile, onAddPlace, onEditAvatar, onCardClick, cards, onCardLike, onCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext);

  
  return currentUser.name ? (
    <main className="content">
      <section className="profile">
        <div className="profile__overlay" onClick={onEditAvatar}>
          <img src={currentUser.avatar} alt="Аватар" className="profile__avatar" />
        </div>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <button type="button" className="profile__edit-button" onClick={onEditProfile}></button>
          <p className="profile__character">{currentUser.about}</p>
        </div>
        <button type="button" className="profile__add-button" onClick={onAddPlace}></button>
      </section>
      <section className="elements">
        {cards.map(el => <Card card={el} key={el._id} onCardClick={onCardClick} onCardLike={onCardLike} onCardDelete={onCardDelete}/>)}
      </section>
    </main>
  ) : (
    <main className="content">
      <div className="spinner"><i></i></div>
    </main>
  )
}

export default Main;