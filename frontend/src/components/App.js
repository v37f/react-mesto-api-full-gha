import { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import Header from "./Header";
import Main from "./Main";
import Login from "./Login";
import Register from "./Register";
import Footer from "./Footer";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmationPopup from "./ConfirmationPopup";
import ImagePopup from "./ImagePopup";
import InfoTooltip from "./InfoToolTip";
import TopBar from "./TopBar";

import { useMediaQuery } from "../hooks/useMediaQuery"

import { CurrentUserContext } from "../contexts/CurrentUserContext";

import api from '../utils/Api';
import * as auth from '../utils/Auth';

import successImagePath from '../images/success.svg';
import failImagePath from '../images/fail.svg';

function App() {
 
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  const [loggedIn, setLoggedIn] = useState(false);
  const [accountData, setAccountData] = useState({
    accountEmail: ''
  });
  const [currentUser, setCurrentUser] = useState(null);

  const [cards, setCards] = useState([]);

  const [isTopBarOpen, setIsTopBarOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [tooltipData, setTooltipData] = useState({
    image: '',
    message: ''
  });
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [deletingCard , setDeletingCard] = useState(null);

  const isAnyPopupOpen = 
    isInfoTooltipOpen || 
    isEditAvatarPopupOpen || 
    isEditProfilePopupOpen || 
    isAddPlacePopupOpen || 
    isConfirmationPopupOpen || 
    selectedCard;

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      api.getUserInfo()
      .then(userInfo => {
        setCurrentUser(userInfo);
      })
      .then(() => {
        api.getInitialCards()
        .then(initialCards => {
          setCards(...cards, initialCards);
        })
        .catch((error) => {
          console.log('Не удалось получить данные карточек от сервера');
          console.log(error);
        });
      })
      .catch((error) => {
        console.log('Не удалось получить данные пользователя от сервера');
        console.log(error);
      });
    }
  }, [loggedIn]);

  useEffect(() => {
    function closePopupsByEscape(evt) {
      if(evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    if(isAnyPopupOpen) { 
      document.addEventListener('keydown', closePopupsByEscape);
      return () => {
        document.removeEventListener('keydown', closePopupsByEscape);
      }
    }
  }, [isAnyPopupOpen]);
   
  // при изменении ширины экрана(например переводе мобильного устройства 
  // из вертикального положения в горизонтальое), закроем верхнюю панель,
  // т.к. кнопка закрытия пропадет из закрыть панель будет уже невозможно
  useEffect(() => {
    setIsTopBarOpen(false);
  }, [isSmallScreen]);

  function checkToken() {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth.getContent(jwt)
      .then((res) => {
        setLoggedIn(true);
        setAccountData({
          accountEmail: res.email
        });
        navigate("/");
      })
      .catch((error) => {
        console.log(`Ошибка: ${error.status}`);
        error.json().then((errorData) => {
          console.log(errorData.message);
        })
      });
    }
  }

  function handleRegister(password, email) {
    return auth.register(password, email)
    .then(() => {
      setTooltipData({
        image: successImagePath,
        message: 'Вы успешно зарегистрировались!'
      });
      navigate("/sign-in");
    })
    .catch((error) => {
      error.json().then((errorData) => {
        let errorMessage = errorData.message;
        if (errorData.validation) {
          errorMessage = errorData.validation.body.message;
        }
        setTooltipData({
          image: failImagePath,
          message: errorMessage
        });
      })
    })
    .finally(()=> {
      setIsInfoTooltipOpen(true);
    });
  }

  function handleLogin(password, email) {
    return auth.login(password, email)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          api.setToken();
          setLoggedIn(true);
          setAccountData({
            accountEmail: email
          });
          navigate("/");
        }
      })
      .catch((error) => {
        error.json()
          .then((errorData) => {
            let errorMessage = errorData.message;
            if (errorData.validation) {
              errorMessage = errorData.validation.body.message;
            }
            setTooltipData({
              image: failImagePath,
              message: errorMessage
            });
          })
          .then(() => {
            setIsInfoTooltipOpen(true);
          });
      });
  }

  function signOut() {
    localStorage.removeItem("jwt");
    navigate("/sign-in");
    setLoggedIn(false);
    setIsTopBarOpen(false);
    setCards([]);
    setCurrentUser(null);
  }  

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function confirmDeletingCard(card) {
    setDeletingCard(card);
    setIsConfirmationPopupOpen(true);
  }

  function closeAllPopups() {
    setIsInfoTooltipOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmationPopupOpen(false)
    setSelectedCard(null);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    })
      .catch((error) => {
        if (isLiked) {
          console.log('Не удалось убрать лайк');
        } else {
          console.log('Не удалось поставить лайк');
        }
        console.log(error);
      });
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter(c => c._id !==card._id));
        closeAllPopups();
      })
      .then(() => {
        setDeletingCard(null);
      })
      .catch((error) => {
        console.log('Не удалось удалить карточку');
        console.log(error);
      });
  }

  function handleUpdateUser({ name, about}) {
    return api.updateUserInfo({ name, about })
      .then(userInfo => {
        setCurrentUser(userInfo);
        closeAllPopups();
      })
      .catch((error) => {
        console.log('Не удалось обновить данные пользователя');
        console.log(error);
      });
  }

  function handleUpdateAvatar(avatarLink) {
    return api.updateAvatar(avatarLink)
      .then(userInfo => {
        setCurrentUser(userInfo);
        closeAllPopups();
      })
      .catch((error) => {
        console.log('Не удалось обновить аватар');
        console.log(error);
      });
  }

  function handleAddPlaceSubmit({ name, link }) {
    return api.addCard({ name, link })
      .then(newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((error) => {
        console.log('Не удалось добавить карточку');
        console.log(error);
      });
  }

  function handleMenuClick() {
    setIsTopBarOpen(!isTopBarOpen);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <TopBar isOpen={isTopBarOpen} accountData={accountData} onSignOut={signOut} />
        <Header 
          accountData={accountData} 
          onSignOut={signOut} 
          onMenuClick={handleMenuClick}
          isSmallScreen={isSmallScreen}
          isTopBarOpen={isTopBarOpen} />
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute 
                loggedIn={loggedIn}
                component={Main}
                onEditProfile={handleEditProfileClick} 
                onAddPlace={handleAddPlaceClick} 
                onEditAvatar={handleEditAvatarClick} 
                onCardClick={handleCardClick} 
                onCardLike={handleCardLike}
                onCardDelete={confirmDeletingCard}
                cards={cards} 
              /> 
            } 
          />
          <Route path="/sign-up" element={<Register handleRegister={handleRegister} />} />
          <Route path="/sign-in" element={<Login handleLogin={handleLogin} />} />
          <Route
            path="*"
            element={loggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />}
          />
        </Routes>
        {loggedIn && <Footer />}

        {currentUser && <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />}

        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />

        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

        <ConfirmationPopup card={deletingCard} isOpen={isConfirmationPopupOpen} onClose={closeAllPopups} onConfirm={handleCardDelete} />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

        <InfoTooltip isOpen={isInfoTooltipOpen} onClose={closeAllPopups} data={tooltipData} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
