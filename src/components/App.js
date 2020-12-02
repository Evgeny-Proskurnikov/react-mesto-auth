import React from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import apiRequest from '../utils/api';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeleteCardPopup from './DeleteCardPopup';
import ErrorPopup from './ErrorPopup';
import { CurrentUserContext, userObj } from '../contexts/CurrentUserContext';
import { CardsContext } from '../contexts/CardsContext';
import { FormSubmitStateContext } from '../contexts/FormSubmitStateContext';


function App() {
  const [isEditProfilePopupOpen, setProfilePopupState] = React.useState(false);
  const [isAddPlacePopupOpen, setPlacePopupState] = React.useState(false);
  const [isEditAvatarPopupOpen, setAvatarPopupState] = React.useState(false);
  const [isDeleteCardPopupOpen, setDeleteCardPopupState] = React.useState(false);
  const [isErrorPopupOpen, setErrorPopupState] = React.useState(false);
  const [isImagePopupOpen, setImagePopupState] = React.useState(false);

  const [error, setErrorState] = React.useState('');
  const [cardToDelete, setCardToDelete] = React.useState({});
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState(userObj);
  const [cards, setCards] = React.useState([]);
  const [submitState, setSubmitState] = React.useState(false);

  const formSubmitState = {state: submitState, setState: setSubmitState};

  React.useEffect(() => {
    Promise.all([apiRequest.getUserInfo(), apiRequest.getInitialCards()])
    .then(([user, items]) => {
      setCurrentUser(user);      
      setCards(items);
    })
    .catch(err => {
      console.log(err);
      handleErrorMessage(err);
    })
  }, []); // eslint-disable-line

  function setEscListener() {
    document.addEventListener('keyup', handleEscPopupClose);
  }

  function handleEditAvatarClick() {
    setAvatarPopupState(true);
    setEscListener();
  }

  function handleEditProfileClick() {
    setProfilePopupState(true);
    setEscListener();
  }

  function handleAddPlaceClick() {
    setPlacePopupState(true);
    setEscListener();
  }

  function handleDeleteCardClick(card) {
    setDeleteCardPopupState(true);
    setCardToDelete(card);
    setEscListener();
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setImagePopupState(true);
    setEscListener();
  }

  function handleErrorMessage(err) {
    setErrorState(err);
    setErrorPopupState(true);
    setEscListener();
  }

  function closeAllPopups() {
    setPlacePopupState(false);
    setProfilePopupState(false);
    setAvatarPopupState(false);
    setDeleteCardPopupState(false);
    setErrorPopupState(false);
    setImagePopupState(false);
    document.removeEventListener('keyup', handleEscPopupClose);
  }

  function handleEscPopupClose(evt) {
    if (evt.key === 'Escape') {
      closeAllPopups();
    }
  }

  function handleUpdateUser(userStateObj) {
    apiRequest.saveUserInfo(userStateObj)
    .then((user) => {
      setCurrentUser(user);
    })
    .catch(err => {
      console.log(err);
      handleErrorMessage(err);
    })
    .finally(() => {
      setProfilePopupState(false);
      setSubmitState(false);
    })
  }

  function handleUpdateAvatar(avatarStateObj) {
    apiRequest.saveAvatar(avatarStateObj)
    .then((avatar) => {
      setCurrentUser(avatar);
    })
    .catch(err => {
      console.log(err);
      handleErrorMessage(err);
    })
    .finally(() => {
      setAvatarPopupState(false);
      setSubmitState(false);
    })
  }

  function handleAddPlaceSubmit(card) {
    apiRequest.postCard(card)
    .then((newCard) => {
      setCards([newCard, ...cards]);
    })
    .catch(err => {
      console.log(err);
      handleErrorMessage(err);
    })
    .finally(() => {
      setPlacePopupState(false);
      setSubmitState(false);
    })
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
      // Отправляем запрос в API и получаем обновлённые данные карточки
    apiRequest.changeLikeCardStatus(card._id, isLiked)
    .then((newCard) => {
        // Формируем новый массив на основе имеющегося, подставляя в него новую карточку
      const newCards = cards.map((c) => c._id === card._id ? newCard : c);
        // Обновляем стейт
      setCards(newCards);
    })
    .catch(err => {
      console.log(err);
      handleErrorMessage(err);
    })
  } 

  function handleCardDelete() {    
    apiRequest.delCard(cardToDelete._id)
    .then(() => {
      const newCards = cards.filter((c) => c._id !== cardToDelete._id);
      setCards(newCards);
    })
    .catch(err => {
      console.log(err);
      handleErrorMessage(err);
    })
    .finally(() => {
      setDeleteCardPopupState(false);
      setSubmitState(false);
    })
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CardsContext.Provider value={cards}>
        <div className="page">
          <Header />
          <Main 
          onEditProfile={handleEditProfileClick} 
          onAddPlace={handleAddPlaceClick} 
          onEditAvatar={handleEditAvatarClick} 
          onCardClick={handleCardClick}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleDeleteCardClick}
          />
          <Footer />

          <FormSubmitStateContext.Provider value={formSubmitState}>
            <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
            <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />
            <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} /> 
            <DeleteCardPopup isOpen={isDeleteCardPopupOpen} onClose={closeAllPopups} onCardDelete={handleCardDelete} /> 
          </FormSubmitStateContext.Provider>
          
          <ErrorPopup isOpen={isErrorPopupOpen} onClose={closeAllPopups} errCode={error} /> 

          <ImagePopup card={selectedCard} modalState={isImagePopupOpen && 'modal_opened'} onClose={closeAllPopups} />
        </div>
      </CardsContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
