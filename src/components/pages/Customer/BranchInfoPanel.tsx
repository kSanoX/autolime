import React from "react";

type Branch = {
  id: string;
  name: string;
  address: string;
  isOpen: boolean;
  manager: {
    phone: string;
  };
};

type Props = {
  branch: Branch;
  onGoToMap?: () => void;
  onGoToCalendar?: () => void;
};

export function BranchInfoPanel({ branch, onGoToMap, onGoToCalendar }: Props) {
  return (
    <div className='branch-info-panel-card visible'>
      <div className='branch-info-panel__content'>
        <div>
          <h3 className='branch-info-panel__title'>{branch.name}</h3>
          <p className='branch-info-panel__text'>{branch.address}</p>
        </div>
        <div>
          <p
            className='branch-info-panel__status'
            style={{
              backgroundColor: branch.isOpen ? "#17BA68" : "#BA1717",
            }}
          >
            {branch.isOpen ? "Open" : "Close"}
          </p>
        </div>
      </div>

      <p className='branch-info-panel__schedule'>
        Mn – Fr <span>9:00 –17:00</span> St – Sn <span>11:00 – 15:00</span>
      </p>

      <div className='branch-info-panel__actions'>
        <a href={`tel:+${branch.manager.phone}`}>
          <button className='call-button'>
            <img
              src='../../src/assets/icons/ManagerOrder/call_icon.svg'
              alt='Call manager'
            />
          </button>
        </a>

        <button onClick={onGoToMap}>
          <img src='../../src/assets/icons/path-icon.svg' alt='Map' />
        </button>

        <button onClick={onGoToMap}>
          <img src='../../../src/assets/icons/geo-icon-yellow.svg' alt='Map' />
        </button>
        <button onClick={onGoToCalendar}>
          <img src='../../src/assets/icons/calendar-icon-yellow.svg' alt='Calendar' />
        </button>
      </div>
    </div>
  );
}
