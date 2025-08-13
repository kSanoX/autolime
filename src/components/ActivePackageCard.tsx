import { useState } from "react";
import { Switch } from "./ui/switch";
import { WashingPackageForm } from "./WashingPackageForm";
import { motion, AnimatePresence } from "framer-motion";
import type { PackageData} from "@/types";
import type { Car } from "@/store/carSlice";

type Props = {
  plate: string;
  model: string;
  washes: number | "infinity";
  period: number;
  startDate: Date;
  autoRenewal: boolean;
  setAutoRenewal: (v: boolean) => void;
  onEdit?: (updated: PackageData) => void;
  cars: Car[];
  onDelete?: (plate: string) => void;
};

export function ActivePackageCard({
  plate,
  model,
  washes,
  period,
  startDate,
  autoRenewal,
  setAutoRenewal,
  onEdit,
  onDelete,
  cars,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + period);

  const initialPackage: PackageData = {
    plate,
    model,
    washes,
    period,
    startDate,
    autoRenewal,
  };

  return (
    <div className='active-package-card'>
      <div className='package-header'>
        <h2>Active package</h2>
        <span>until {endDate.toLocaleDateString("en-GB")}</span>
      </div>

      <div className='vehicle-info'>
        <span>Your vehicle</span>
        <p className='vehicle-plate'>
          {plate} <span>({model})</span>
        </p>
      </div>

      <div className='package-details'>
        <div className='detail-block'>
          <span className='detail-label'>
            <img src='../../../src/assets/icons/drop-icon.svg' alt='' /> Washes
          </span>
          <span className='detail-value'>
            {washes === "infinity" ? "∞" : washes}
          </span>
          <span className='deatil-name'>remaining</span>
        </div>
        <div className='detail-block'>
          <span className='detail-label'>
            <img src='../../../src/assets/icons/time.svg' alt='' /> Period
          </span>
          <span className='detail-value'>{period}</span>
          <span className='deatil-name'>month</span>
        </div>
      </div>

      <div className='switch-block-active-package'>
        <span>Auto-renewal</span>
        <Switch
          onCheckedChange={(val) => setAutoRenewal(val)}
          checked={autoRenewal}
        />
      </div>

      <div className='package-actions'>
      <button onClick={() => setShowDeletePopup(true)}>
  <img src='../../../src/assets/icons/trash-icon.svg' alt='Delete' />
</button>
        <button onClick={() => setIsEditing((prev) => !prev)}>
          <img src='../../../src/assets/icons/reload-icon.svg' alt='reload' />
        </button>
        <button>
          <img
            src='../../../src/assets/icons/calendar-icon-yellow.svg'
            alt='calendar'
          />
        </button>
        <button>
          <img src='../../../src/assets/icons/qr-icon-yellow.svg' alt='qr' />
        </button>
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <WashingPackageForm
              mode='edit'
              isVisible={true}
              cars={cars}
              initialPackage={initialPackage}
              onClose={() => setIsEditing(false)}
              onSubmit={(updated) => {
                onEdit?.(updated);
                setIsEditing(false);
              }}
              compact={true}
              activePackages={[]}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {showDeletePopup && (
  <>
    <div className='package-delete-backdrop' onClick={() => setShowDeletePopup(false)} />
    <div className='package-delete-popup'>
      <h2>Package canceling</h2>
      <p>Do you really want to cancel this vehicle?</p>
      <div className='package-delete-popup-btns'>
        <button onClick={() => setShowDeletePopup(false)}>Cancel</button>
        <button
  onClick={() => {
    onDelete?.(plate);
    setShowDeletePopup(false);
  }}
>
  Delete
</button>
      </div>
    </div>
  </>
)}
    </div>
  );
}
