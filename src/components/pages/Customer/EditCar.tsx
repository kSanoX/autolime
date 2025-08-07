import React, { useState, useEffect } from "react";
import { CarBrandDropDown } from "@/components/ui/CarBrandDropDown";
import { CarModelDropDown } from "@/components/ui/CarModelDropDown";
import { useAppDispatch } from "../../../hooks/hooks";
import { setBrand, setModel, updateCar, removeCar } from "@/store/carSlice";
import { useNavigate, useLocation, useParams } from "react-router-dom";
export default function EditCar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const carToEdit = location.state?.car;

  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [brand, setBrandLocal] = useState(carToEdit?.brand || "");
  const [model, setModelLocal] = useState(carToEdit?.model || "");
  const [numberPlate, setNumberPlate] = useState(carToEdit?.plate || "");
  const [error, setError] = useState("");
  const [deletePopupShow,setDeletePopupShow] = useState(false);
  const [isClosing, setIsClosing] = useState(false);


  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const part1 = value.slice(0, 2);
    const part2 = value.slice(2, 6);
    const part3 = value.slice(6, 8);
    const formatted =
      part1 + (part2 ? " - " + part2 : "") + (part3 ? " - " + part3 : "");
    setNumberPlate(formatted);
    setError("");
  };

  const isValidPlate = /^([A-Z]{2}) - ([0-9]{4}) - ([A-Z]{2})$/.test(
    numberPlate
  );
  const isFormReady = brand && model && isValidPlate;

  const handleSubmit = () => {
    if (!isValidPlate) {
      setError("Invalid number plate format");
      return;
    }

    dispatch(updateCar({ oldPlate: carToEdit.plate, brand, model, plate: numberPlate }));
    navigate("/customer-my-data");
  };
  const handleDelete = () => {
    setIsClosing(true);
  
    setTimeout(() => {
      dispatch(removeCar(carToEdit.plate));
      setDeletePopupShow(false);
      setIsClosing(false);
      navigate("/customer-my-data");  
    }, 300);
  };
  

  return (
    <div className='edit-car-screen'>
      <header>
        <img
          src='src/assets/icons/left-arrow.svg'
          alt='Back'
          onClick={() => navigate(-1)}
        />
        <h3>Edit Vehicle</h3>
        <img src='src/assets/icons/close-icon.svg' alt='Close' />
      </header>

      <div className='edit-car-content'>
        <p className='edit-car-title-info'>Update your vehicle's data</p>

        <div className='input-block'>
          <label>Car brand</label>
          <div
            className='input-select'
            onClick={() => setBrandDropdownOpen(true)}
          >
            <span className={brand ? "active" : ""}>
              {brand || "Choose your car brand"}
            </span>
            <img src='src/assets/icons/left-arrow.svg' alt='Arrow' />
          </div>
        </div>

        <div className='input-block'>
          <label>Car model</label>
          <div
            className={`input-select ${!brand ? "disabled" : ""}`}
            onClick={() => brand && setModelDropdownOpen(true)}
          >
            <span className={model ? "active" : ""}>
              {model || "Choose your car model"}
            </span>
            <img src='src/assets/icons/left-arrow.svg' alt='Arrow' />
          </div>
        </div>

        <div className='number-plate-input'>
          <label>Number plate</label>
          <div className='input-with-prefix'>
            <input
              placeholder='XX - XXXX - XX'
              className='custom-input'
              value={numberPlate}
              onChange={handlePlateChange}
              maxLength={14}
            />
          </div>
          {error && <span className='plate-error'>{error}</span>}
        </div>

        <button
          className={`add-car-btn ${isFormReady ? "active" : ""}`}
          onClick={handleSubmit}
          disabled={!isFormReady}
        >
          Save Changes
        </button>
        <button className='vehicle-delete-btn' onClick={()=> setDeletePopupShow(true)}>Delete vehicle</button>
      </div>

      {deletePopupShow && (
  <>
    <div
      className={`delete-vehicle-overlay ${isClosing ? "fade-out" : ""}`}
    ></div>
    <div
      className={`delete-vehicle-popup ${isClosing ? "fade-out" : ""}`}
    >
      <h4>Vehicle deleting</h4>
      <p>Do you really want to remove this vehicle?</p>
      <div className="delete-vehicle-popup-btns">
        <button onClick={() => setDeletePopupShow(false)}>Cancel</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  </>
)}

      <CarBrandDropDown
        open={brandDropdownOpen}
        setOpen={setBrandDropdownOpen}
        applyBrand={(b) => setBrandLocal(b)}
      />
      <CarModelDropDown
        open={modelDropdownOpen}
        setOpen={setModelDropdownOpen}
        selectedBrand={brand}
        applyModel={(m) => setModelLocal(m)}
      />
    </div>
  );
}
