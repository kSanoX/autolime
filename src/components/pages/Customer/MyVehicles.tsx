import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/hooks";
import { useFetchCars } from "@/hooks/useFetchCars";

export default function MyVehicles() {
  const { loading, error } = useFetchCars();
  const vehicles = useAppSelector((state) => state.car.cars);
  const navigate = useNavigate();

  return (
    <div className='vehicles-wrapper'>
      <h1>My vehicles</h1>

      {loading && <p>Loading vehicles...</p>}
      {error && <p className='error'>{error}</p>}

      {!loading && vehicles.length === 0 && <p>No vehicles found</p>}

      {vehicles.map((car, index) => (
        <div key={index}>
          <img src='images/hatchback_image.png' alt='vehicle-image' />
          <div className='vehicles-flex'>
            <div className='vehicles-info'>
              <h4 className='auto-number'>{car.plate}</h4>
              <p>{car.model.name}</p>
            </div>
            <div>
              <button
                onClick={() => navigate("/edit-car", { state: { car } })}
                style={{ padding: "0px" }}
              >
                <img src='src/assets/icons/edit-note-icon.svg' alt='edit-icon' />
              </button>
            </div>
          </div>
          <hr />
        </div>
      ))}

      <Link to='/add-car'>
        <button>Add Car</button>
      </Link>
    </div>
  );
}
