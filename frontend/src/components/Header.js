import { Link } from 'react-router-dom';
import logo from '../images/header-logo.svg';

const Header = ({ ...props }) => {
  const { email, toLink, onSignOut, textLink } = props;
  return (
    <header className='header'>
      <img src={logo} alt='Логотип' className='header__logo' />
      <div className='header__info'>
        {email ? <p className='header__email'>{email}</p> : ''}
        <Link className='header__btn' to={toLink} onClick={onSignOut}>
          {textLink}
        </Link>
      </div>
    </header>
  );
};

export default Header;
