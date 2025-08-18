import { useEffect, useState } from "react";
import { useFetchCars } from "@/hooks/useFetchCars";
import { customFetch } from "@/utils/customFetch";
import Header from "@/components/Header";
import "../../../styles/customer_styles/qr-page.scss";
import { useMyPackages } from "@/hooks/useActivePackages";

export default function QRPage() {
  const {
    packages: carPackages,
    isLoading: packagesLoading,
    error: packagesError,
  } = useMyPackages();

  const {
    cars,
    loading: carsLoading,
    error: carsError,
  } = useFetchCars();

  const [activePlate, setActivePlate] = useState<string | null>(null);
  const [activePackageId, setActivePackageId] = useState<number | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);

  const carIdToPackage = Object.fromEntries(
    carPackages.map((p) => [p.car.id, p])
  );

  const closeOverlay = () => {
    setActivePlate(null);
    setActivePackageId(null);
    setQrImageUrl(null);
  };

  useEffect(() => {
    if (!activePackageId) return;

    const token = localStorage.getItem("access_token");

    customFetch(
      `${import.meta.env.VITE_API_URL}/packages/${activePackageId}/qr`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
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
  }, [activePackageId]);

  if (carsLoading || packagesLoading) {
    return (
      <div className="qr-page-wrapper">
        <Header title="QR" logoVariant="qr" />
        <p className="loading">Loading data...</p>
      </div>
    );
  }

  if (carsError || packagesError) {
    return (
      <div className="qr-page-wrapper">
        <Header title="QR" logoVariant="qr" />
        <p className="error">Failed to load data</p>
      </div>
    );
  }

  return (
    <div>
      <Header title="QR" logoVariant="qr" />
      <div className="qr-page-wrapper">
        {/* QR Overlay */}
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

        {/* Машины */}
        {cars.length === 0 ? (
          <p className="no-cars">You have no registered cars.</p>
        ) : (
          <div className="car-list">
            {cars.map((car) => {
              const pkg = carIdToPackage[car.id];
              const canGenerateQR = pkg != null;

              return (
                <div key={car.id} className="car-card">
                  <img src="/images/hatchback_image.png" alt={car.type} />
                  <p className="car-plate">{car.plate}</p>
                  <p className="car-model">{car.type}</p>

                  {canGenerateQR && (
                    <button
                      className="qr-btn"
                      onClick={() => {
                        setActivePackageId(pkg.id);
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
