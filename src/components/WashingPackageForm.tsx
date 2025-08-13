import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "./ui/switch";
import { InfinityIcon } from "./ui/InfinityIcon";
import type { PackageData } from "@/types";
import { CarDropDown } from "./ui/CarDropDown";
import type { Car, CarPreview } from "@/store/carSlice";
import { useMemo } from "react";
import { useActivatePackage } from "@/hooks/useActivatePackage";

type Props = {
  mode: "create" | "edit";
  isVisible: boolean;
  cars: Car[]; // полный тип
  initialPackage?: PackageData;
  onSubmit: (pkg: PackageData) => void;
  onClose: () => void;
  compact?: boolean;
  activePackages: PackageData[];
};

export function WashingPackageForm({
  mode,
  isVisible,
  cars,
  initialPackage,
  onSubmit,
  onClose,
  compact,
  activePackages,
}: Props) {
  const [selectedCar, setSelectedCar] = useState<CarPreview | null>(null);
  const [selectedWashCount, setSelectedWashCount] = useState<number | "infinity" | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [autoRenewal, setAutoRenewal] = useState(true);
  const [carDropOpen, setCarDropOpen] = useState(false);
  const { activatePackage, loading, error, success } = useActivatePackage();


  const availableCars: CarPreview[] = useMemo(() => {
    return mode === "create"
      ? cars
          .filter((car) => !activePackages.some((pkg) => pkg.plate === car.plate))
          .map((car) => ({ plate: car.plate }))
      : cars.map((car) => ({ plate: car.plate }));
  }, [mode, cars, activePackages]);
  
  useEffect(() => {
    if (mode === "edit" && initialPackage && isVisible) {
      const car = availableCars.find((c) => c.plate === initialPackage.plate) ?? null;
      setSelectedCar(car);
      setSelectedWashCount(initialPackage.washes);
      setSelectedTerm(initialPackage.period);
      setAutoRenewal(initialPackage.autoRenewal);
    } else if (mode === "create" && isVisible) {
      setSelectedCar(availableCars[0] ?? null);
    }
  }, [mode, initialPackage, availableCars, isVisible]);

  const handleSubmit = async () => {
    if (!selectedCar || !selectedWashCount || !selectedTerm) return;
  
    await activatePackage({
      plate: selectedCar.plate,
      number_of_washes: selectedWashCount,
      sub_term: selectedTerm,
      renewal: autoRenewal,
    });
  
    onSubmit({
      plate: selectedCar.plate,
      washes: selectedWashCount,
      model: "",
      period: selectedTerm,
      startDate: initialPackage?.startDate ?? new Date(),
      autoRenewal,
    });
  
    onClose();
  };  

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`washing-package-block ${compact ? "compact" : ""}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1>{mode === "edit" ? "Update package" : "Washing package"}</h1>
          <p className='package-warn'>
            Package price depends on the type of vehicle
          </p>

          {/* Vehicle selector */}
          {mode === "create" && (
            <div className='you-vehicle'>
              <span>Your vehicle</span>
              {availableCars.length === 1 ? (
                <p className='vehicle-number-plate'>
                  {availableCars[0].plate}
                </p>
              ) : (
                <div
                  onClick={() => setCarDropOpen(true)}
                  className='vehicle-dropdown'
                >
                  <button className='vehicle-selector'>
                    {selectedCar?.plate}
                  </button>
                  <img
                    src='../../../src/assets/icons/left-arrow.svg'
                    alt='arrow'
                  />
                </div>
              )}
            </div>
          )}

          {/* Wash count */}
          <div className='number-washers-select'>
            <p>Number of washes</p>
            <div className='washers-select-options'>
              {[12, 24, "infinity" as const].map((count) => (
                <div
                  key={count}
                  className={selectedWashCount === count ? "active" : ""}
                  onClick={() => setSelectedWashCount(count)}
                >
                  {count === "infinity" ? (
                    <InfinityIcon
                      color={
                        selectedWashCount === "infinity" ? "#F7B233" : "#183D69"
                      }
                    />
                  ) : (
                    count
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Term */}
          <div className='number-washers-select'>
            <p>Subscription term</p>
            <div className='pheriod-select-options'>
              {[1, 3, 6, 12].map((term) => (
                <div
                  key={term}
                  className={selectedTerm === term ? "active" : ""}
                  onClick={() => setSelectedTerm(term)}
                >
                  <span>{term}</span>
                  <span
                    style={{
                      color: selectedTerm === term ? "#F7B233" : "#183D69",
                    }}
                  >
                    month
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Renewal */}
          <div className='renewal'>
            <div>Auto-renewal</div>
            <Switch
              checked={autoRenewal}
              onCheckedChange={(val) => setAutoRenewal(val)}
            />
          </div>

          {/* Price */}
          <div className='sub-price-block'>
            <p>Subscription price</p>
            <p className='price'>₾ 700</p>
          </div>

          {/* Submit */}
          <button
            className='activate-package-btn'
            disabled={
              !selectedCar || !selectedTerm || selectedWashCount === null
            }
            onClick={handleSubmit}
          >
            {mode === "edit" ? "Update package" : "Activate package"}
          </button>
        </motion.div>
      )}
      {carDropOpen && selectedCar && (
        <CarDropDown
          open={carDropOpen}
          setOpen={setCarDropOpen}
          selectedCar={selectedCar}
          cars={availableCars}
          applyCar={(car) => setSelectedCar(car)}
        />
      )}
    </AnimatePresence>
  );
}
