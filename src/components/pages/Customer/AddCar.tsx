import React, { useState } from "react";
import { CarBrandDropDown } from "@/components/CarBrandDropDown";
import { CarModelDropDown } from "@/components/CarModelDropDown";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { setBrand, setModel } from "@/store/carSlice";

export default function AddCar() {
  const dispatch = useAppDispatch();
  const brand = useAppSelector((state) => state.car.brand);
  const model = useAppSelector((state) => state.car.model);

  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  return (
    <div className="add-car-screen">
  <header>
    <img src='src/assets/icons/left-arrow.svg' alt='Back' />
    <h3>Add Vehicle</h3>
    <img src='src/assets/icons/close-icon.svg' alt='Close' />
  </header>

  <div className="add-car-content">
    <p className="add-car-title-info">Enter your vehicle's data</p>

    <div className="input-block">
      <label>Car brand</label>
      <div
        className="input-select"
        onClick={() => setBrandDropdownOpen(true)}
      >
        <span className={brand ? "active" : ""}>
          {brand || "Choose your car brand"}
        </span>
        <img src='src/assets/icons/left-arrow.svg' alt='Arrow' />
      </div>
    </div>

    <div className="input-block">
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
          <label>Phone number</label>
          <div className='input-with-prefix'>
            <input
              placeholder='XX - XXXX - XX'
              className='custom-input'
            />
          </div>
        </div>
        <button className="add-car-btn">Add</button>
  </div>

  <CarBrandDropDown
    open={brandDropdownOpen}
    setOpen={setBrandDropdownOpen}
    applyBrand={(selected) => dispatch(setBrand(selected))}
  />

  <CarModelDropDown
    open={modelDropdownOpen}
    setOpen={setModelDropdownOpen}
    selectedBrand={brand}
    applyModel={(m) => dispatch(setModel(m))}
  />
</div>
  );
}
