import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

const Card = ({ card, onCardClick, onCardLike, onCardDelete }) => {
  const currentUser = useContext(CurrentUserContext);

  const { _id } = currentUser;
  const { name, link, likes, owner } = card;

  const handleCardLike = () => {
    onCardLike(card);
  };

  const handleLikeClick = () => {
    onCardClick(card);
  };

  const handleDeleteClick = () => {
    onCardDelete(card);
  };

  const isOwn = owner._id === _id;
  const cardDeleteButtonClassName = `elements__card-delete ${
    isOwn ? '' : 'elements__card-delete_hidden'
  }`;

  const isLiked = likes.some((i) => i._id === _id);
  const cardLikeButtonClassName = `elements__like ${
    isLiked ? 'elements__like_active' : ''
  }`;

  return (
    <li className='elements__item'>
      <img
        className='elements__image'
        alt={name}
        src={link}
        onClick={handleLikeClick}
      />
      <button
        className={cardDeleteButtonClassName}
        onClick={handleDeleteClick}
      ></button>

      <div className='elements__description'>
        <h2 className='elements__title'>{name}</h2>
        <div className='elements__block-like'>
          <button
            className={cardLikeButtonClassName}
            onClick={handleCardLike}
          ></button>
          <span className='elements__count-like'>{likes.length}</span>
        </div>
      </div>
    </li>
  );
};

export default Card;
