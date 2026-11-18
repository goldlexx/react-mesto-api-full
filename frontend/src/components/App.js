import { useState, useEffect, useCallback } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Register from './Register';
import Login from './Login';
import InfoTooltip from './InfoTooltip';
import ProtectedRoute from './ProtectedRoute';
import api from '../utils/api';
import * as apiAuth from '../utils/apiAuth';

import { CurrentUserContext } from '../contexts/CurrentUserContext';

const App = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedMessage, setFeedMessage] = useState('');
  const [cards, setCards] = useState([]);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({
    name: '',
    link: '',
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [authPending, setAuthPending] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [email, setEmail] = useState('practicum@yandex.ru');
  const [IsInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false);
  const [message, setMessage] = useState(false);
  const isOpen =
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    IsInfoToolTipOpen ||
    selectedCard.link;

  useEffect(() => {
    if (!loggedIn) return;

    let active = true;
    api.getCardList().then(items => {
      if (active) setCards(items);
    }).catch(() => {
      if (active) setFeedMessage('Не удалось загрузить карточки. Обновите страницу.');
    }).finally(() => {
      if (active) setFeedLoading(false);
    });
    return () => { active = false; };
  }, [loggedIn]);

  useEffect(() => {
    const closeByEscape = (evt) => {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      };
    }
  }, [isOpen]);

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setSelectedCard({ name: '', link: '' });
    setIsInfoToolTipOpen(false);
  };

  const setStateCards = (id, newCard) => {
    setCards((state) => state.map((c) => (c._id === id ? newCard : c)));
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleEditProfileClick = () => {
    setEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setAddPlacePopupOpen(true);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const tokenCheck = useCallback(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      apiAuth
        .checkToken(jwt)
        .then((res) => {
          if (res) {
            setCurrentUser(res);
            setEmail(res.email);
            setLoggedIn(true);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  useEffect(() => {
    tokenCheck();
  }, [tokenCheck]);

  const onRegister = (email, password) => {
    setAuthPending(true);
    apiAuth
      .register(password, email)
      .then((data) => {
        setMessage(true);
        navigate('/signin');
      })
      .catch((err) => {
        setMessage(false);
        console.error(err);
      })
      .finally(() => {
        setAuthPending(false);
        setIsInfoToolTipOpen(true);
      });
  };

  const onLogin = (email, password) => {
    setAuthPending(true);
    setLoginError(false);
    apiAuth
      .authorize(email, password)
      .then(async (res) => {
        if (!res.token) throw new Error('Missing session token');
        localStorage.setItem('jwt', res.token);
        setCurrentUser(res.user || await api.getUserInfo());
        setEmail(email);
        setLoggedIn(true);
        navigate('/');
      })
      .catch(() => setLoginError(true))
      .finally(() => setAuthPending(false));
  };

  const onSignOut = () => {
    localStorage.removeItem('jwt');
    setCards([]);
    setCurrentUser({});
    setFeedMessage('');
    setFeedLoading(true);
    setLoggedIn(false);
  };

  const handleCardDelete = (card) => {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((item) => item._id !== card._id));
      })
      .catch((err) => console.error(err));
  };

  const handleCardLike = (card) => {
    const isLiked = card.likes.some((i) => i === currentUser._id);
    if (isLiked) {
      api
        .removeLikeCard(card._id, !isLiked)
        .then((newCard) => {
          setStateCards(card._id, newCard);
        })
        .catch((err) => console.error(err));
    } else {
      api
        .addLikeCard(card._id, !isLiked)
        .then((newCard) => {
          setStateCards(card._id, newCard);
        })
        .catch((err) => console.error(err));
    }
  };

  const handleUpdateUser = (card) => {
    api
      .setUserInfo(card)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.error(err));
  };

  const handleUpdateAvatar = (card) => {
    api
      .setUserAvatar(card.avatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.error(err));
  };

  const handleUpdateCards = (data) => {
    api
      .addNewCard(data)
      .then((newCard) => {
        setCards(items => [newCard, ...items]);
        closeAllPopups();
      })
      .catch((err) => console.error(err));
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className='page__content'>
        {loggedIn && (feedLoading || feedMessage) && <p role='status'>{feedMessage || 'Загружаем карточки…'}</p>}
        <Routes>
          <Route
            path='/'
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Header
                  onSignOut={onSignOut}
                  email={email}
                  toLink={'/'}
                  textLink={'Выйти'}
                />
                <Main
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                />
                <Footer />
              </ProtectedRoute>
            }
          />

          <Route
            path='/signup'
            element={<Register pending={authPending} onRegister={onRegister} />}
          />
          <Route path='/signin' element={loggedIn ? <Navigate to='/' replace /> : <Login pending={authPending} error={loginError} onLogin={onLogin} />} />
          <Route
            path='*'
            element={loggedIn ? <Navigate to='/' /> : <Navigate to='/signin' />}
          />
        </Routes>

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateAvatar}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onUpdateCards={handleUpdateCards}
        />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

        <InfoTooltip
          IsInfoToolTipOpen={IsInfoToolTipOpen}
          message={message}
          onClose={closeAllPopups}
        />
      </div>
    </CurrentUserContext.Provider>
  );
};

export default App;
