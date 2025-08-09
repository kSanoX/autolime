import React, { useState } from "react";
import { useSelector } from "react-redux";
import { QRCodeCanvas } from "qrcode.react";
import { type RootState } from "@/store";
import "../../../styles/customer_styles/qr-page.scss";

export default function QRPage() {
  const cars = useSelector((s: RootState) => s.car.cars);
  const [activePlate, setActivePlate] = useState<string | null>(null);

  const closeOverlay = () => setActivePlate(null);

  return (
    <div className="qr-page-wrapper">
      {activePlate && (
        <div className="qr-overlay">
          <button className="close-btn" onClick={closeOverlay}>✕</button>
          <div className="qr-container">
            <QRCodeCanvas value={activePlate} size={200} />
            <p className="plate-label">{activePlate}</p>
          </div>
        </div>
      )}

      {cars.length === 0 ? (
        <p className="no-cars">You have no registered cars.</p>
      ) : (
        <div className="car-list">
          {cars.map((car, i) => (
            <div key={i} className="car-card">
              <img
                src="../../../../public/images/hatchback_image.png"
                alt={`${car.brand} ${car.model}`}
              />
              <p className="car-plate">{car.plate}</p>
              <p className="car-model">
                {car.brand} {car.model}
              </p>
              <button
                className="qr-btn"
                onClick={() => setActivePlate(car.plate)}
              >
                <img
                  src="../../../src/assets/icons/qr-icon-yellow.svg"
                  alt="Show QR"
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
