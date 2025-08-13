import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { customFetch } from "@/utils/customFetch";
import leftArrow from "@/assets/icons/left-arrow.svg";
import closeIcon from "@/assets/icons/close-icon.svg";

export default function EditCar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { carid } = useParams();

  const [carToEdit, setCarToEdit] = useState(location.state?.car || null);
  const [brand, setBrandLocal] = useState("");
  const [model, setModelLocal] = useState("");
  const [numberPlate, setNumberPlate] = useState("");
  const [error, setError] = useState("");
  const [deletePopupShow, setDeletePopupShow] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const carId = carToEdit?.id || carid;

  useEffect(() => {
    if (!carToEdit && carId) {
      const token = localStorage.getItem("access_token");
      customFetch(`${import.meta.env.VITE_API_URL}/mycars/${carId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Failed to fetch car");
          const data = await res.json();
          setCarToEdit(data);
          setBrandLocal(data.brand || "");
          setModelLocal(data.model || "");
          setNumberPlate(data.plate || "");
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load car data");
        });
    } else if (carToEdit) {
      setBrandLocal(carToEdit.brand || "");
      setModelLocal(carToEdit.model || "");
      setNumberPlate(carToEdit.plate || "");
    }
  }, [carToEdit, carId]);

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const part1 = value.slice(0, 2);
    const part2 = value.slice(2, 5);
    const part3 = value.slice(5, 7);
    const formatted =
      part1 + (part2 ? " - " + part2 : "") + (part3 ? " - " + part3 : "");
    setNumberPlate(formatted);
    setError("");
  };

  const isValidPlate = /^([A-Z]{2}) - ([0-9]{3}) - ([A-Z]{2})$/.test(numberPlate);
  const isFormReady = brand && model && isValidPlate;

  const handleSubmit = async () => {
    if (!isValidPlate) {
      setError("Invalid number plate format");
      return;
    }

    const token = localStorage.getItem("access_token");

    try {
      const response = await customFetch(
        `${import.meta.env.VITE_API_URL}/mycars/${carId}/edit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            brand,
            model,
            plate: numberPlate,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update car");

      navigate("/customer-my-data");
    } catch (err) {
      console.error(err);
      setError("Failed to save changes");
    }
  };

  const handleDelete = async () => {
    setIsClosing(true);
    const token = localStorage.getItem("access_token");

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/mycars/${carId}/remove`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });   

      setTimeout(() => {
        setDeletePopupShow(false);
        setIsClosing(false);
        navigate("/customer-my-data");
      }, 300);
    } catch (err) {
      console.error(err);
      setError("Failed to delete car");
      setIsClosing(false);
    }
  };

  return (
    <div className='edit-car-screen'>
      <header>
        <img src={leftArrow} alt='Back' onClick={() => navigate(-1)} />
        <h3>Edit Vehicle</h3>
        <img src={closeIcon} alt='Close' />
      </header>

      <div className='edit-car-content'>
        <p className='edit-car-title-info'>Update your vehicle's data</p>

        <div className='input-block'>
          <label>Car brand</label>
          <div className='input-select disabled'>
            <span className='active'>{brand || "Unknown brand"}</span>
            <img src={leftArrow} alt='Locked' />
          </div>
        </div>

        <div className='input-block'>
          <label>Car model</label>
          <div className='input-select disabled'>
            <span className='active'>{model || "Unknown model"}</span>
            <img src={leftArrow} alt='Locked' />
          </div>
        </div>

        <div className='number-plate-input'>
          <label>Number plate</label>
          <div className='input-with-prefix'>
            <input
              placeholder='XX - XXX - XX'
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
        <button
          className='vehicle-delete-btn'
          onClick={() => setDeletePopupShow(true)}
        >
          Delete vehicle
        </button>
      </div>

      {deletePopupShow && (
        <>
          <div className={`delete-vehicle-overlay ${isClosing ? "fade-out" : ""}`} />
          <div className={`delete-vehicle-popup ${isClosing ? "fade-out" : ""}`}>
            <h4>Vehicle deleting</h4>
            <p>Do you really want to remove this vehicle?</p>
            <div className='delete-vehicle-popup-btns'>
              <button onClick={() => setDeletePopupShow(false)}>Cancel</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
