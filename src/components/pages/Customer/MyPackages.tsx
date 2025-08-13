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

export default function MyPackages() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cars = useSelector((state: RootState) => state.car.cars);
  const [activePackages, setActivePackages] = useState<PackageData[]>([]);
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

  const availableCars = cars.filter(
    (car) => !activePackages.some((pkg) => pkg.plate === car.plate)
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

        {showForm && (
          <WashingPackageForm
            mode={editingPackage ? "edit" : "create"}
            isVisible={true}
            cars={cars}
            activePackages={activePackages}
            initialPackage={editingPackage ?? undefined}
            onClose={() => setEditingPackage(null)}
            onSubmit={(newPackage) => {
              if (editingPackage) {
                setActivePackages((prev) =>
                  prev.map((p) =>
                    p.plate === editingPackage.plate ? newPackage : p
                  )
                );
                setEditingPackage(null);
              } else {
                setActivePackages((prev) => [...prev, newPackage]);
              }
            }}
          />
        )}

        {activePackages.length === 0 ? (
          <p className='no-packages'></p>
        ) : (
          activePackages.map((pkg) => (
            <ActivePackageCard
              key={pkg.plate}
              plate={pkg.plate}
              model={pkg.model}
              washes={pkg.washes}
              period={pkg.period}
              startDate={pkg.startDate}
              autoRenewal={pkg.autoRenewal}
              setAutoRenewal={(val) => {
                setActivePackages((prev) =>
                  prev.map((p) =>
                    p.plate === pkg.plate ? { ...p, autoRenewal: val } : p
                  )
                );
              }}
              onEdit={(updated) => {
                setActivePackages((prev) =>
                  prev.map((p) => (p.plate === updated.plate ? updated : p))
                );
              }}
              onDelete={(plate) => {
                setActivePackages((prev) =>
                  prev.filter((pkg) => pkg.plate !== plate)
                );
              }}
              cars={cars}
            />
          ))
        )}
      </div>
    </div>
  );
}
