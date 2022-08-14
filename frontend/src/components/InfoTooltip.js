const InfoTooltip = ({ IsInfoToolTipOpen, message, onClose }) => {
  const handlePopup = IsInfoToolTipOpen ? 'popup_opened' : '';
  const handleImage = message
    ? 'popup__image_type_success'
    : 'popup__image_type_fail';
  const handleMessage = message
    ? 'Вы успешно зарегистрировались!'
    : 'Что-то пошло не так! Попробуйте ещё раз.';

  return (
    <div className={`popup popup_type_info ${handlePopup}`}>
      <div className='popup__container popup__container_type_info'>
        <div className={`popup__image ${handleImage}`}></div>
        <p className='popup__text'>{handleMessage}</p>
        <button
          className='popup__button-close'
          type='button'
          aria-label='Кнопка закрытия'
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default InfoTooltip;
