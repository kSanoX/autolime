import React, { useState } from "react";
import { CarBrandDropDown } from "@/components/ui/CarBrandDropDown";
import { CarModelDropDown } from "@/components/ui/CarModelDropDown";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { setBrand, setModel, addCar } from "@/store/carSlice";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { customFetch } from "@/utils/customFetch";
import { useCarBrands } from "@/hooks/useCarBrands";
import type { Brand, Model, Car } from "@/store/carSlice";

export default function AddCar({ showHeader }: { showHeader?: boolean }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const brand = useAppSelector((state) => state.car.brand);
  const model = useAppSelector((state) => state.car.model);

  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [numberPlate, setNumberPlate] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [addedCar, setAddedCar] = useState<Car | null>(null);
  const location = useLocation();
  const shouldShowHeader = location.state?.fromRegistration === false;
  const [models, setModels] = useState<Model[]>([]);
  const { brands, loading } = useCarBrands();

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

  const handleBrandSelect = async (selected: Brand) => {
    dispatch(setBrand(selected));
    setBrandDropdownOpen(false);

    const token = localStorage.getItem("access_token");
    const res = await customFetch(
      `${import.meta.env.VITE_API_URL}/cars/brands/${selected.id}/models`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      setModels(data.models);
      setModelDropdownOpen(true);
    } else {
      console.error("Failed to load models");
    }
  };

  const isValidPlate = /^([A-Z]{2}) - ([0-9]{4}) - ([A-Z]{2})$/.test(
    numberPlate
  );
  const isFormReady = brand && model && isValidPlate;

  const handleSubmit = async () => {
    if (!isValidPlate) {
      setError("Invalid number plate format");
      return;
    }
  
    const newCar: Car = {
      brand: brand!,
      model: model!,
      plate: numberPlate,
    };
  
    const token = localStorage.getItem("access_token");
  
    try {
      const res = await customFetch(`${import.meta.env.VITE_API_URL}/api/mycars/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCar),
      });
  
      if (!res.ok) {
        throw new Error("Failed to add car to server");
      }
  
      dispatch(addCar(newCar));
      setAddedCar(newCar);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Server error: unable to add car");
    }
  };  

  const resetForm = () => {
    dispatch(setBrand(null));
    dispatch(setModel(null));
    setNumberPlate("");
    setSubmitted(false);
    setError("");
    setAddedCar(null);
  };

  return (
    <div className='add-car-screen'>
      {shouldShowHeader && (
        <header>
          <img src='src/assets/icons/left-arrow.svg' alt='Back' />
          <h3>Add Vehicle</h3>
          <img src='src/assets/icons/close-icon.svg' alt='Close' />
        </header>
      )}
      <div className='add-car-content'>
        <h1>Add Car</h1>
        {!submitted ? (
          <>
            <p className='add-car-title-info'>Enter your vehicle's data</p>

            <div className='input-block'>
              <label>Car brand</label>
              <div
                className='input-select'
                onClick={() => setBrandDropdownOpen(true)}
              >
                <span className={brand ? "active" : ""}>
                  {brand?.name || "Choose your car brand"}
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
                  {model?.name || "Choose your car model"}
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
              Add
            </button>
          </>
        ) : (
          <div className='add-car-success'>
            <p
              style={{
                color: "#183D69",
                fontSize: "18px",
                textAlign: "center",
              }}
            >
              <span style={{ fontWeight: "700" }}> Congratulations!</span> Your
              vehicle has been <br /> successfully added
            </p>

            <div className='car-preview'>
              <img src='images/hatchback_image.png' alt='added car' />
              <div>
                <h4>{addedCar?.plate}</h4>
                <span className='car-type'>SUV</span>
              </div>
            </div>

            <div className='after-submit-btns'>
              <button
                className='add-car-btn'
                onClick={resetForm}
                style={{ backgroundColor: "#83D69", color: "#F7B233" }}
              >
                Add one more
              </button>
              <button
                className='add-car-btn secondary'
                onClick={() => navigate("/customer-my-data")}
                style={{ background: "#83D69", color: "#F7B233" }}
              >
                Use the app
              </button>
            </div>
          </div>
        )}
      </div>

      <CarBrandDropDown
  open={brandDropdownOpen}
  setOpen={setBrandDropdownOpen}
  applyBrand={handleBrandSelect} 
  brands={brands}
  loading={loading}
/>

<CarModelDropDown
  open={modelDropdownOpen}
  setOpen={setModelDropdownOpen}
  selectedBrand={brand}
  models={models}
  applyModel={(m) => dispatch(setModel(m))}
/>
    </div>
  );
}
