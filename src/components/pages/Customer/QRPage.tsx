import React, { useEffect, useState } from "react";
import { useFetchCars } from "@/hooks/useFetchCars";
import { useLoadAppointmentsFromBackend } from "@/hooks/useLoadAppointmentsFromBackend";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";
import { customFetch } from "@/utils/customFetch";
import Header from "@/components/Header";
import "../../../styles/customer_styles/qr-page.scss";

export default function QRPage() {
  const { cars, loading, error } = useFetchCars();
  useLoadAppointmentsFromBackend();

  const appointments = useSelector((s: RootState) => s.appointments.appointments);

  const [activePlate, setActivePlate] = useState<string | null>(null);
  const [activeAppointmentId, setActiveAppointmentId] = useState<number | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);

  const closeOverlay = () => {
    setActivePlate(null);
    setActiveAppointmentId(null);
    setQrImageUrl(null);
  };

  useEffect(() => {
    if (!activeAppointmentId) return;

    const token = localStorage.getItem("access_token");

    customFetch(`${import.meta.env.VITE_API_URL}/appointments/${activeAppointmentId}/qr_code`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch QR code");
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setQrImageUrl(url);
      })
      .catch((err) => {
        console.error("QR fetch error:", err);
        setQrImageUrl(null);
      });
  }, [activeAppointmentId]);

  return (
    <div>
      <Header title="QR" logoVariant="qr" />
      <div className="qr-page-wrapper">
        {activePlate && (
          <div className="qr-overlay">
            <button className="close-btn" onClick={closeOverlay}>
              ✕
            </button>
            <div className="qr-container">
              <p className="plate-label">{activePlate}</p>
              {qrImageUrl ? (
                <img src={qrImageUrl} alt="QR Code" className="qr-image" />
              ) : (
                <p>Loading QR...</p>
              )}
            </div>
          </div>
        )}

        {loading && <p className="loading">Loading cars...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && cars.length === 0 ? (
          <p className="no-cars">You have no registered cars.</p>
        ) : (
          <div className="car-list">
            {cars.map((car) => {
              const appointment = appointments.find((a) => a.carId === car.id);

              return (
                <div key={car.id} className="car-card">
                  <img src="/images/hatchback_image.png" alt={car.type} />
                  <p className="car-plate">{car.plate}</p>
                  <p className="car-model">{car.type}</p>

                  {appointment && (
                    <button
                      className="qr-btn"
                      onClick={() => {
                        setActiveAppointmentId(appointment.id);
                        setActivePlate(car.plate);
                      }}
                    >
                      <img
                        src="/src/assets/icons/qr-icon-yellow.svg"
                        alt="Show QR"
                      />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
