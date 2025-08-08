import React, { useEffect, useState } from 'react';
import logo from '@/assets/logo.svg';
import "../styles/header.scss";
import Sidebar from '../components/ui/Sidebar';

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  return (
    <>
      <header className='header-container'>
        <img
          className='cursor-pointer'
          src="../../icons/b-menu.svg"
          alt="burger-menu"
          onClick={() => setIsSidebarOpen(true)}
        />
        <img className='logo' src={logo} alt="Logo" />
        <img src="../../icons/bell_active_icon.svg" alt="notification-bell" />
      </header>

      {isSidebarOpen && (
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      )}
    </>
  );
}
