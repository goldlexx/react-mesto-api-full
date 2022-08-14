import { useRef, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

const EditAvatarPopup = ({ isOpen, onClose, onUpdateUser }) => {
  const avatarRef = useRef();

  useEffect(() => {
    avatarRef.current.value = '';
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateUser({
      avatar: avatarRef.current.value,
    });
  };

  return (
    <PopupWithForm
      name='add-avatar'
      title='Обновить аватар'
      titleBtn='Сохранить'
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label className='popup__form-link'>
        <input
          ref={avatarRef}
          type='url'
          name='link'
          placeholder='Ссылка на картинку'
          autoComplete='off'
          className='popup__input popup__input_type_card-link'
          id='reference'
          required
        />
        <span className='popup__error' id='reference-error'></span>
      </label>
    </PopupWithForm>
  );
};

export default EditAvatarPopup;
