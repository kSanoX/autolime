import logo from '@/assets/logo.svg';
import "../styles/header.scss"
export default function Header() {
  return (
    <header className='header-container'>
      <img className='cursor-pointer' src="../../icons/b-menu.svg" alt="burger-menu" />
      <img className='logo' src={logo} alt="Logo" />
      <img src="../../icons/bell_active_icon.svg" alt="" />
    </header>
  )
}
 