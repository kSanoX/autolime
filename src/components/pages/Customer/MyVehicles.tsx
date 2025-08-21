import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/hooks";
import { useFetchCars } from "@/hooks/useFetchCars";
import { useTranslation } from "@/hooks/useTranslation";


export default function MyVehicles() {
  const vehicles = useAppSelector((state) => state.car.cars);
  const navigate = useNavigate();
  const { cars, loading, error } = useFetchCars();
  const t = useTranslation();

  return (
    <div className='vehicles-wrapper'>
      <h1>{t("MyVehicles.title")}</h1>

      {loading && <p>{t("MyVehicles.loading")}</p>}
      {error && <p className='error'>{error}</p>}

      {!loading && cars.length === 0 && <p>{t("MyVehicles.empty")}</p>}

      {cars.map((car, index) => (
        <div key={index}>
          <img src='images/hatchback_image.png' alt='vehicle-image' />
          <div className='vehicles-flex'>
            <div className='vehicles-info'>
              <h4 className='auto-number'>{car.plate}</h4>
              <p className='car-type'>{car.type}</p>
            </div>
            <div>
              <button
                onClick={() => navigate(`/edit-car/${car.id}`, { state: { car } })}
                style={{ padding: "0px" }}
              >
                <img
                  src='src/assets/icons/edit-note-icon.svg'
                  alt='edit-icon'
                />
              </button>
            </div>
          </div>
          <hr />
        </div>
      ))}

      <Link to='/add-car'>
        <button>{t("MyVehicles.buttons.add")}</button>
      </Link>
    </div>
  );
}
