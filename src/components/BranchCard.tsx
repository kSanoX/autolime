import { useNavigate } from "react-router-dom";
import { BranchInfoPanel } from "./pages/Customer/BranchInfoPanel";
import type { Branch } from "@/hooks/useFetchBranches";

export function BranchCard({ branch, onClick, isActive }: {
  branch: Branch;
  onClick: () => void;
  isActive: boolean;
}) {
  const navigate = useNavigate();

  const handleCalendarClick = (e) => {
    e.stopPropagation();
    navigate("/wash-appointment", {
      state: {
        selectedBranchId: branch.id,
      },
    });
  };

  const handleGoToMap = (e) => {
    e.stopPropagation();
    navigate("/branches", {
      state: {
        selectedBranchId: branch.id,
        viewMode: "map",
      },
      replace: true,
    });
  };

  const extraButton = isActive ? (
    <button onClick={handleGoToMap}>
      <img src="../../src/assets/icons/geo-icon-yellow.svg" alt="geo" />
    </button>
  ) : (
    <button onClick={handleCalendarClick}>
      <img src="../../src/assets/icons/calendar-icon-yellow.svg" alt="calendar" />
    </button>
  );

  return (
    <div onClick={onClick} className={`branch-card ${isActive ? "active-branch" : ""}`}>
      <BranchInfoPanel branch={branch} extraActions={extraButton} />
      {isActive && (
  <img
    src="../src/assets/icons/calendar-ok.svg"
    alt="Booked"
    className="branch-booked-icon"
  />
)}

    </div>
  );
}
