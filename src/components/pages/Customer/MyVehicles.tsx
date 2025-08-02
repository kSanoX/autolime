import React from "react";

export default function MyVehicles() {
  return (
    <div className='vehicles-wrapper'>
      <h1>My vehicles</h1>
      <img src='images/hatchback_image.png' alt='vehicles-image' />
      <div className='vehicles-flex'>
        <div className='vehicles-info'>
          <h4 className='auto-number'>AR - 111 - TT</h4>
          <p>Hatchback</p>
        </div>
        <div>
            <img src="src/assets/icons/edit-note-icon.svg" alt="edit-icon" />
        </div>
      </div>
      <hr />
      <button>Add Car</button>
    </div>
  );
}
