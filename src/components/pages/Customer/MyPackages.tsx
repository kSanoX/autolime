import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/hooks";
import { setCars } from "@/store/carSlice";
import { type RootState } from "@/store";
import { ActivePackageCard } from "@/components/ActivePackageCard";
import { WashingPackageForm } from "@/components/WashingPackageForm";
import type { PackageData } from "@/types";
import { customFetch } from "@/utils/customFetch";
import { useMyPackages } from "@/hooks/useActivePackages";

export default function MyPackages() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cars = useSelector((state: RootState) => state.car.cars);
  const { packages, isLoading, error } = useMyPackages();

  const [editingPackage, setEditingPackage] = useState<PackageData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    customFetch(`${import.meta.env.VITE_API_URL}/mycars`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch cars");
        const data = await res.json();
        dispatch(setCars(data.cars));
      })
      .catch((err) => {
        console.error("Car fetch error:", err);
      });
  }, []);

  const getMonthDiff = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    return e.getMonth() - s.getMonth() + (e.getFullYear() - s.getFullYear()) * 12;
  };

  const transformedPackages: PackageData[] = packages.map((pkg) => ({
    plate: pkg.car.plate,
    model: pkg.package.car_type,
    washes: pkg.number_of_washes - pkg.used_washes,
    period: getMonthDiff(pkg.start_date, pkg.end_date),
    startDate: new Date(pkg.start_date),
    autoRenewal: pkg.renewal,
  }));

  const availableCars = cars.filter(
    (car) => !transformedPackages.some((pkg) => pkg.plate === car.plate)
  );

  const showForm = editingPackage || availableCars.length > 0;

  return (
    <div>
      <header>
        <img
          onClick={() => navigate(-1)}
          src='../../../src/assets/icons/left-arrow.svg'
          alt='Back'
        />
        My packages
        <span></span>
      </header>

      <div className='my-packages-wrapper'>
        <div className='swap-type-display-packages'>
          <button>Active</button>
          <button>History</button>
        </div>

        {isLoading ? (
          <p>Загрузка...</p>
        ) : error ? (
          <p>Ошибка: {error.message}</p>
        ) : (
          <>
            {showForm && (
              <WashingPackageForm
                mode={editingPackage ? "edit" : "create"}
                isVisible={true}
                cars={cars}
                activePackages={transformedPackages}
                initialPackage={editingPackage ?? undefined}
                onClose={() => setEditingPackage(null)}
                onSubmit={(newPackage) => {
                  setEditingPackage(null);
                }}
              />
            )}

            {transformedPackages.length === 0 ? (
              <p className='no-packages'>No active packages</p>
            ) : (
              transformedPackages.map((pkg) => (
                <ActivePackageCard
                  key={pkg.plate}
                  plate={pkg.plate}
                  model={pkg.model}
                  washes={pkg.washes}
                  period={pkg.period}
                  startDate={pkg.startDate}
                  autoRenewal={pkg.autoRenewal}
                  setAutoRenewal={(val) => {
                    // можно сделать PATCH на бэкенд
                    console.log(`Set autoRenewal for ${pkg.plate} →`, val);
                  }}
                  onEdit={(updated) => {
                    setEditingPackage(updated);
                  }}
                  onDelete={(plate) => {
                    console.log(`Удалить пакет для ${plate}`);
                  }}
                  cars={cars}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
