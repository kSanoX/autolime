import React from "react";

type Branch = {
  id: string;
  name: string;
  address: string;
  isOpen: boolean;
};

type Props = {
  branch: Branch;
  onGoToMap?: () => void;
  extraActions?: React.ReactNode;
};

export function BranchInfoPanel({ branch, extraActions }: Props) {
  return (
    <div className="branch-info-panel-card visible">
      <div className="branch-info-panel__content">
        <div>
          <h3 className="branch-info-panel__title">{branch.name}</h3>
          <p className="branch-info-panel__text">{branch.address}</p>
        </div>
        <div>
          <p
            className="branch-info-panel__status"
            style={{
              backgroundColor: branch.isOpen ? "#17BA68" : "#BA1717",
            }}
          >
            {branch.isOpen ? "Open" : "Close"}
          </p>
        </div>
      </div>
      <p className="branch-info-panel__schedule">
        Mn – Fr <span>9:00 –17:00</span> St – Sn <span>11:00 – 15:00</span>
      </p>
      <div className="branch-info-panel__actions">
        <button>
          <img src="../../src/assets/icons/ManagerOrder/call_icon.svg" alt="" />
        </button>
        <button>
          <img src="../../src/assets/icons/path-icon.svg" alt="" />
        </button>
        {extraActions}
      </div>
    </div>
  );
}
