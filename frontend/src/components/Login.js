import Header from './Header';
import { useForm } from '../hoocks/useForm';

const Login = ({ onLogin }) => {
  const controlInput = useForm();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = controlInput.values;
    onLogin(email, password);
  };

  return (
    <>
      <Header textLink={'Регистрация'} toLink={'/sign-up'} />
      <main>
        <section className='authorization'>
          <form
            action='#'
            className='authorization__form'
            onSubmit={handleSubmit}
          >
            <fieldset className='authorization__content'>
              <h2 className='authorization__title'>Вход</h2>

              <label className='authorization__form-field'>
                <input
                  type='email'
                  name='email'
                  placeholder='Email'
                  autoComplete='off'
                  className='authorization__input'
                  onChange={controlInput.handleChange}
                  value={controlInput?.values?.email || ''}
                  minLength='5'
                  maxLength='40'
                  required
                />
              </label>
              <label className='authorization__form-field'>
                <input
                  type='password'
                  name='password'
                  placeholder='Пароль'
                  autoComplete='off'
                  className='authorization__input'
                  onChange={controlInput.handleChange}
                  value={controlInput?.values?.password || ''}
                  minLength='5'
                  maxLength='40'
                  required
                />
              </label>
              <button type='submit' className='authorization__submit-button'>
                Войти
              </button>
            </fieldset>
          </form>
        </section>
      </main>
    </>
  );
};

export default Login;
