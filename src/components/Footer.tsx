import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <Link to='/'>
        <img src="../../src/assets/icons/home_icon.svg" alt='...' />
      </Link>
      <Link to='/page-1'>
        <img src='../../src/assets/icons/calendar_icon.svg' alt='...' />
      </Link>
      <Link to='/page-1'>
        <img src='../src/assets/icons/qr_icon.svg' alt='...' />
      </Link>
      <Link to='/carwash-statistics'>
        <img src='../src/assets/icons/car-icon.svg' alt='...' />
      </Link>
      <Link to='/profile'>
        <img src='../src/assets/icons/user_icon.svg' alt='...' />
      </Link>
    </footer>
  );
}
