import { useNavigate } from 'react-router-dom';
import HeaderLogo from '../assets/Header.png';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="header-top">
      <div>
        <img src={HeaderLogo} alt="That One Dish" className="header-logo" />
      </div>
    </header>
  );
}
