import React from 'react'

export default function CustomerContactInfo() {
  return (
    <div className='customer-contact-info-wrapper'>
        <div className='customer-contact-info-container'>
            <h1>Contact information</h1>
            <div className="customer-phone-number">
                <div>
                    <p>Phone number</p>
                    <p><span className='dot-status'></span> +995 500 500 555</p>
                </div>
                <div>
                    <img src="src/assets/icons/edit-note-icon.svg" alt="editNote" />
                </div>
            </div>
            <div className="customer-email">
                <div>
                    <p>Email  <span className='verification-status'> Uncomfiemed</span></p>
                    <p><span className='dot-status'></span> ivyl@gmail.com</p>
                </div>
                <div>
                <img src="src/assets/icons/edit-note-icon.svg" alt="editNote" />
                </div>
            </div>
        </div>
    </div>
  )
}
