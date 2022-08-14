const ImagePopup = ({ card, onClose }) => {
  return (
    <div
      className={`popup popup_type_zoom-photo ${card.link && 'popup_opened'}`}
    >
      <div className='popup__photo-container'>
        <button
          className='popup__button-close'
          type='button'
          aria-label='Кнопка закрытия popup'
          onClick={onClose}
        ></button>
        <figure className='popup__figure'>
          <img src={card.link} alt={card.name} className='popup__zoom-photo' />
          <figcaption className='popup__caption'>{card.name}</figcaption>
        </figure>
      </div>
    </div>
  );
};

export default ImagePopup;
