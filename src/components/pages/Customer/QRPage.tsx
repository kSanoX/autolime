import { useEffect, useState } from "react";
import { useFetchCars } from "@/hooks/useFetchCars";
import { customFetch } from "@/utils/customFetch";
import Header from "@/components/Header";
import "../../../styles/customer_styles/qr-page.scss";
import { useMyPackages } from "@/hooks/useActivePackages";
import { useTranslation } from "@/hooks/useTranslation";
const NO_API_URL = import.meta.env.VITE_NO_API_URL;

export default function QRPage() {
  const t = useTranslation();

  const {
    packages: carPackages,
    isLoading: packagesLoading,
    error: packagesError,
  } = useMyPackages();

  const { cars, loading: carsLoading, error: carsError } = useFetchCars();

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
      <div className='qr-page-wrapper'>
        <Header title={t("QRPage.header.title")} logoVariant='qr' />
        <p className='loading'>{t("QRPage.loading")}</p>
      </div>
    );
  }

  if (carsError || packagesError) {
    return (
      <div className='qr-page-wrapper'>
        <Header title={t("QRPage.header.title")} logoVariant='qr' />
        <p className='error'>{t("QRPage.error")}</p>
      </div>
    );
  }

  return (
    <div>
      <Header title={t("QRPage.header.title")} logoVariant='qr' />
      <div className='qr-page-wrapper'>
        {/* QR Overlay */}
        {activePlate && (
          <div className='qr-overlay'>
            <button className='close-btn' onClick={closeOverlay}>
              {t("QRPage.overlay.close")}
            </button>
            <div className='qr-container'>
              <p className='plate-label'>{activePlate}</p>
              {qrImageUrl ? (
                <img src={qrImageUrl} alt='QR Code' className='qr-image' />
              ) : (
                <p>{t("QRPage.overlay.loading")}</p>
              )}
            </div>
          </div>
        )}

        {/* Машины */}
        {cars.length === 0 ? (
          <p className='no-cars'>{t("QRPage.noCars")}</p>
        ) : (
          <div className='car-list'>
            {cars.map((car) => {
              const pkg = carIdToPackage[car.id];
              const canGenerateQR = pkg != null;

              return (
                <div key={car.id} className='car-card'>
                  <img src={`${NO_API_URL}${car.image}`} alt={car.type} />
                  <p className='car-plate'>{car.plate}</p>
                  <p className='car-model'>
                    {t("QRPage.car.model")}: {car.type}
                  </p>

                  {canGenerateQR && (
                    <button
                      className='qr-btn'
                      onClick={() => {
                        setActivePackageId(pkg.id);
                        setActivePlate(car.plate);
                      }}
                    >
                      <img src='../../../src/assets/icons/qr_icon.svg' alt='' />
                    </button>
                  )}
                  {canGenerateQR && (
                    <span style={{ textAlign: "end", color: "#4B6D95" }}>
                      Generate QR
                    </span>
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
