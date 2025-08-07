import { useNavigate } from "react-router-dom";
import { BranchInfoPanel } from "./pages/Customer/BranchInfoPanel";

export function BranchCard({ branch, onClick, actionType = "geo" }) {
  const navigate = useNavigate();

  const handleCalendarClick = (e) => {
    e.stopPropagation();
    navigate("/wash-appointment", { state: { branch } });
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

  const extraButton =
    actionType === "calendar" ? (
      <button onClick={handleCalendarClick}>
        <img src="../../src/assets/icons/calendar-icon-yellow.svg" alt="calendar" />
      </button>
    ) : (
      <button onClick={handleGoToMap}>
        <img src="../../src/assets/icons/geo-icon-yellow.svg" alt="geo" />
      </button>
    );

  return (
    <div onClick={onClick}>
      <BranchInfoPanel branch={branch} extraActions={extraButton} />
    </div>
  );
}
