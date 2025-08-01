import { Link } from "react-router-dom";

export default function CustomerNavBar() {
  return (
    <div className="nav-bar-wrapper">
    <nav className="nav-bar-container">
      <Link to='/'>
        <img src="../../src/assets/icons/home_icon.svg" alt='...' />
      </Link>
      <Link to='/'>
        <img src='../../src/assets/icons/calendar_icon.svg' alt='...' />
      </Link>
      <Link to='/page-1'>
        <img src='../src/assets/icons/qr_icon.svg' alt='...' />
      </Link>
      <Link to='/'>
        <img src='../src/assets/icons/car-icon.svg' alt='...' />
      </Link>
      <Link to='/customer-my-data'>
        <img src='../src/assets/icons/user_icon.svg' alt='...' />
      </Link>
    </nav>
    </div>
  );
}
