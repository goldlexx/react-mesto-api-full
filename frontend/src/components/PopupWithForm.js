const PopupWithForm = ({
  name,
  title,
  titleBtn,
  isOpen,
  onClose,
  onSubmit,
  children,
}) => {
  return (
    <div className={`popup popup_type_${name}` + (isOpen && ' popup_opened')}>
      <div className='popup__container'>
        <button
          className='popup__button-close'
          type='button'
          aria-label='Кнопка закрытия'
          onClick={onClose}
        />

        <form
          action='#'
          className='popup__form'
          name={name}
          onSubmit={onSubmit}
        >
          <fieldset className='popup__content'>
            <h2 className='popup__title'>{title}</h2>
            {children}

            <button type='submit' className='popup__submit-button'>
              {titleBtn}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default PopupWithForm;
