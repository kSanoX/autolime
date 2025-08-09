import React from 'react'
import "../styles/Contacts.scss"
import { useNavigate } from 'react-router-dom'

export default function Contacts() {
    const navigate = useNavigate();
  return (
    <div>
        <header>
            <img onClick={()=> navigate(-1)} src="../src/assets/icons/left-arrow.svg" alt="" />
            Contacts
            <span></span>
        </header>
        <div className='contacts-wrapper'>
            <h4>Our main office</h4>
            <label htmlFor="">Address</label>
            <h4>Tbilisi, Georgia</h4>
            <label htmlFor="">Phone</label>
            <h4>+995 706 500 50 50</h4>
            <label htmlFor="">Email</label>
            <h4>geocarmail@gmail.com</h4>
            <label htmlFor="">Website</label>
            <h4>geocar.com</h4>
            <label htmlFor="">Working Hours</label>
            <h4>Mn - Fr 9:00 - 17:00</h4>
        </div>
    </div>
  )
}
