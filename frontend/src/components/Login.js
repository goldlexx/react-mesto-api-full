import Header from './Header';
import { useFormWithValidation } from '../hoocks/useFormWithValidation';

const Login = ({ onLogin }) => {
  const controlInput = useFormWithValidation();
  const { email, password } = controlInput.errors;
  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = controlInput.values;
    onLogin(email, password);
  };
  const errorClassName = !controlInput.isValid
    ? 'authorization__error authorization__error_visible'
    : 'authorization__error';

  return (
    <>
      <Header textLink={'Регистрация'} toLink={'/signup'} />
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
                <span className={errorClassName}>{email}</span>
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
                <span className={errorClassName}>{password}</span>
              </label>
              <button
                type='submit'
                className='authorization__submit-button'
                disabled={!controlInput.isValid}
              >
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
