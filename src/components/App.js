import React from 'react';
import { Route, Switch, Redirect, useHistory, Link } from 'react-router-dom';
import { CurrentUserContext, userObj } from '../contexts/CurrentUserContext';
import { CardsContext } from '../contexts/CardsContext';
import { FormSubmitStateContext } from '../contexts/FormSubmitStateContext';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import apiRequest from '../utils/api';
import * as auth from '../utils/auth';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeleteCardPopup from './DeleteCardPopup';
import ErrorPopup from './ErrorPopup';
import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import InfoToolTip from './InfoToolTip';


function App() {
  const [isEditProfilePopupOpen, setProfilePopupState] = React.useState(false);
  const [isAddPlacePopupOpen, setPlacePopupState] = React.useState(false);
  const [isEditAvatarPopupOpen, setAvatarPopupState] = React.useState(false);
  const [isDeleteCardPopupOpen, setDeleteCardPopupState] = React.useState(false);
  const [isErrorPopupOpen, setErrorPopupState] = React.useState(false);
  const [isImagePopupOpen, setImagePopupState] = React.useState(false);
  const [isInfoToolTipOpen, setInfoToolTipState] = React.useState(false);

  const [error, setErrorState] = React.useState('');
  const [cardToDelete, setCardToDelete] = React.useState({});
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState(userObj);
  const [cards, setCards] = React.useState([]);
  const [submitState, setSubmitState] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [authRequest, setAuthRequest] = React.useState(false);
  const [authUserData, setAuthUserData] = React.useState({});
  const [spinnerState, setSpinnerState] = React.useState(false);
  const history = useHistory();

  // записываем стейт для формы модальных окон
  const formSubmitState = {state: submitState, setState: setSubmitState};

  const regHeaderStyle = {display: 'flex', justifyContent: 'space-between'};

  // получаем инфо пользователя и дефолтные карточки 
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

  // проверка валидности токена для автоматической авторизации
  React.useEffect(() => {
    tokenCheck();
  }, []) // eslint-disable-line

  // добавление обработчика закрытия модалок на ESC
  function setEscListener() {
    document.addEventListener('keyup', handleEscPopupClose);
  }

  // открытие модалки редактирования аватара
  function handleEditAvatarClick() {
    setAvatarPopupState(true);
    setEscListener();
  }

  // открытие модалки редактирования профиля
  function handleEditProfileClick() {
    setProfilePopupState(true);
    setEscListener();
  }

  // открытия модалки добавления новой карточки
  function handleAddPlaceClick() {
    setPlacePopupState(true);
    setEscListener();
  }

  // открытие модалки подтверждения удаления карточки
  function handleDeleteCardClick(card) {
    setDeleteCardPopupState(true);
    setCardToDelete(card);
    setEscListener();
  }

  // открытие модалки изображения карточки
  function handleCardClick(card) {
    setSelectedCard(card);
    setImagePopupState(true);
    setEscListener();
  }

  // открытие модалки при ошибке
  function handleErrorMessage(err) {
    setErrorState(err);
    setErrorPopupState(true);
    setEscListener();
  }

  // закрытие всех модальных окон
  function closeAllPopups() {
    setPlacePopupState(false);
    setProfilePopupState(false);
    setAvatarPopupState(false);
    setDeleteCardPopupState(false);
    setErrorPopupState(false);
    setImagePopupState(false);
    setInfoToolTipState(false)
    document.removeEventListener('keyup', handleEscPopupClose);
  }

  // закрытие модалки на Esc
  function handleEscPopupClose(evt) {
    if (evt.key === 'Escape') {
      closeAllPopups();
    }
  }

  // сохранение новой информации о пользователе
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

  // сохранение нового аватара пользователя
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

  // добавление новой карточки
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

  // лайк/дизлайк карточки
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

  // удаление карточки
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

  // открытие модалки результата регистрации/логина пользователя
  function handleAuthRequest(boolean) {
    setAuthRequest(boolean);
    setInfoToolTipState(true);
    setEscListener();
  }

  // регистрация пользователя
  function submitRegisterForm({ password, email }) {
    auth.register({password, email})
      .then(res => {
        if (res) {
          setAuthUserData(res.data);
          handleAuthRequest(true);
          history.push('/sign-in');
        }
      })
      .catch(err => {
        console.log(err);
        handleAuthRequest(false);
      })
      .finally(() => setSubmitState(false));
  }

  // логин пользователя
  function submitLoginForm({ password, email }) {
    auth.authorize({password, email})
      .then(res => {
        if (res) {
          localStorage.setItem('token', res.token);
          setAuthUserData({email});
          setLoggedIn(true);
          history.push('/');
        } 
      })
      .catch(err => {
        console.log(err);
        handleAuthRequest(false);
      })
      .finally(() => setSubmitState(false));
  }

  // проверка токена
  function tokenCheck() {
    const jwt = localStorage.getItem('token');
    if (jwt) {
      setSpinnerState(true);
      auth.getUserData(jwt)
      .then(res => {
        if (res.data.email) {
          setAuthUserData(res.data);
          setSpinnerState(false);
          setLoggedIn(true);
          history.push('/');
        }
        setSpinnerState(false);
      })
      .catch(err => console.log(err))
    }
  }

  // выйти из аккаунта, очистить локальное хранилище
  function handleLogOut() {
    setLoggedIn(false);
    localStorage.clear();
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CardsContext.Provider value={cards}>
        {spinnerState ? <div className="spinner"><i></i></div> :
          <div className="page">
            {loggedIn && 
              <Header 
              linkTitle='Выйти' 
              authUserData={authUserData} 
              children={
                <>
                  <p className='header__text'>{authUserData.email}</p>
                  <Link to='sign-in' className='header__link' onClick={handleLogOut}>Выйти</Link>
                </>
              }/>
            }

            <Switch>
              <ProtectedRoute 
                exact
                path='/' 
                loggedIn={loggedIn} 
                component={Main}
                onEditProfile={handleEditProfileClick} 
                onAddPlace={handleAddPlaceClick} 
                onEditAvatar={handleEditAvatarClick} 
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleDeleteCardClick}
              />
              <Route path='/sign-up'>
                <Header style={regHeaderStyle} children={
                  <Link to='sign-in' className='header__link'>Войти</Link>
                }/>
                <Register 
                  title='Регистрация' 
                  btnName='Зарегистрироваться' 
                  submitRegisterForm={submitRegisterForm}
                  submitState={submitState}
                  setSubmitState={setSubmitState}
                  children={
                    <Link to='sign-in' className='form__login-link' >Уже зарегистрированы? Войти</Link>
                  }
                />
              </Route>
              <Route path='/sign-in'>
                <Header style={regHeaderStyle} children={
                  <Link to='sign-up' className='header__link'>Регистрация</Link>
                }/>
                <Login 
                  title='Вход' 
                  btnName='Войти' 
                  submitLoginForm={submitLoginForm}
                  submitState={submitState}
                  setSubmitState={setSubmitState}
                />
              </Route>
              <Route exact path='/'>
                {loggedIn ? <Redirect to='/' /> : <Redirect to='/sign-in' />}
              </Route>
            </Switch>
            
            <Footer />
            <FormSubmitStateContext.Provider value={formSubmitState}>
              <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
              <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />
              <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} /> 
              <DeleteCardPopup isOpen={isDeleteCardPopupOpen} onClose={closeAllPopups} onCardDelete={handleCardDelete} /> 
            </FormSubmitStateContext.Provider>
            <ErrorPopup isOpen={isErrorPopupOpen} onClose={closeAllPopups} errCode={error} /> 
            <ImagePopup card={selectedCard} modalState={isImagePopupOpen && 'modal_opened'} onClose={closeAllPopups} />
            <InfoToolTip isOpen={isInfoToolTipOpen} onClose={closeAllPopups} requestState={authRequest} />
          </div>
        }
      </CardsContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
