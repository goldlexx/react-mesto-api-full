import { useEffect, useContext } from 'react';
import { useForm } from '../hoocks/useForm';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

const EditProfilePopup = ({ isOpen, onClose, onUpdateUser }) => {
  const currentUser = useContext(CurrentUserContext);
  const controlInput = useForm();

  useEffect(() => {
    controlInput.setValues({
      name: currentUser.name,
      about: currentUser.about,
    });
  }, [currentUser, isOpen]);

  const handleSubmit = (e) => {
    const { name, about } = controlInput.values;
    e.preventDefault();
    onUpdateUser({
      name,
      about: about,
    });
  };

  return (
    <PopupWithForm
      name='edit'
      title='Редактировать профиль'
      titleBtn='Сохранить'
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label className='popup__form-field'>
        <input
          onChange={controlInput.handleChange}
          value={controlInput?.values?.name || ''}
          type='text'
          name='name'
          id='name'
          placeholder='Введите имя'
          autoComplete='off'
          className='popup__input popup__input_type_name'
          required
          minLength={2}
          maxLength={40}
        />
        <span className='popup__error' id='name-error'></span>
      </label>
      <label className='popup__form-field'>
        <input
          onChange={controlInput.handleChange}
          value={controlInput?.values?.about || ''}
          type='text'
          name='about'
          placeholder='Введите профессию'
          autoComplete='off'
          className='popup__input popup__input_type_job'
          required
          minLength={2}
          maxLength={200}
          id='job'
        />
        <span className='popup__error' id='job-error'></span>
      </label>
    </PopupWithForm>
  );
};

export default EditProfilePopup;
