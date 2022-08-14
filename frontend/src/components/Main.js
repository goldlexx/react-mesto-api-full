import { useContext } from 'react';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

const Main = ({
  onEditProfile,
  onAddPlace,
  onEditAvatar,
  onCardClick,
  cards,
  onCardLike,
  onCardDelete,
}) => {
  const currentUser = useContext(CurrentUserContext);
  const { name, about, avatar } = currentUser;

  return (
    <main>
      <section className='profile'>
        <div className='profile__author'>
          <button
            className='profile__edit-avatar'
            type='button'
            onClick={onEditAvatar}
          >
            <img src={avatar} alt='Аватар' className='profile__avatar' />
          </button>
        </div>
        <div className='profile__info'>
          <h1 className='profile__name'>{name}</h1>
          <button
            type='button'
            className='profile__edit-button'
            aria-label='Кнопка изменения профиля'
            onClick={onEditProfile}
          ></button>
          <p className='profile__job'>{about}</p>
        </div>
        <button
          type='button'
          className='profile__add-button'
          aria-label='Кнопка добавления фотографии'
          onClick={onAddPlace}
        ></button>
      </section>

      <section className='elements' aria-label='Блок с карточками'>
        <ul className='elements__list'>
          {cards.map((card) => (
            <Card
              card={card}
              key={card._id}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
            />
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Main;
