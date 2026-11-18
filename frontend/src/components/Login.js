import Header from './Header';
import { useFormWithValidation } from '../hoocks/useFormWithValidation';

const Login = ({ onLogin, pending, error }) => {
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
            noValidate
          >
            <fieldset className='authorization__content'>
              <h2 className='authorization__title'>Вход</h2>

              <label className='authorization__form-field'>
                <input
                  type='email'
                  name='email'
                  placeholder='Email'
                  autoComplete='email'
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
                  autoComplete='current-password'
                  className='authorization__input'
                  onChange={controlInput.handleChange}
                  value={controlInput?.values?.password || ''}
                  minLength='5'
                  maxLength='40'
                  required
                />
                <span className={errorClassName}>{password}</span>
              </label>
              {error && <p role='alert'>Не удалось войти. Проверьте подключение и данные для входа.</p>}
              <button
                type='submit'
                className='authorization__submit-button'
                disabled={pending || !controlInput.isValid}
              >
                {pending ? 'Подождите…' : 'Войти'}
              </button>
            </fieldset>
          </form>
        </section>
      </main>
    </>
  );
};

export default Login;
