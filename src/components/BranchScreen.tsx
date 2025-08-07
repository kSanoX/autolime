import { useEffect, useState } from "react";
import { BranchCard } from "./BranchCard";
import { BranchMap } from "./BranchMap";
import "leaflet/dist/leaflet.css";
import { useLocation } from "react-router-dom";

export default function BranchScreen() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const location = useLocation();
  const locationState = location.state as {
    selectedBranchId?: string;
    viewMode?: "map" | "list";
  } | null;

  useEffect(() => {
    if (locationState?.selectedBranchId) {
      setSelectedBranchId(locationState.selectedBranchId);
    }
    if (locationState?.viewMode) {
      setViewMode(locationState.viewMode);
    }
  }, [locationState]);
  

  type Branch = {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
  };

  const branches: Branch[] = [
    {
      id: "1",
      name: "Tbilisi Central",
      address: "Rustaveli Ave, 22",
      lat: 41.7151,
      lng: 44.799,
      isOpen: true,
      openTime: "10:00",
      closeTime: "19:00",
    },
    {
      id: "2",
      name: "Batumi Seaside",
      address: "Gorgiladze St, 88",
      lat: 41.65,
      lng: 41.6367,
      isOpen: false,
      openTime: "09:00",
      closeTime: "17:00",
    },
    {
      id: "3",
      name: "Kutaisi Market",
      address: "Chavchavadze St, 5",
      lat: 42.2482,
      lng: 42.7,
      isOpen: true,
      openTime: "08:30",
      closeTime: "17:30",
    },
    {
      id: "4",
      name: "Tbilisi Vake",
      address: "Tamarashvili St, 15",
      lat: 41.7213,
      lng: 44.765,
      isOpen: true,
      openTime: "09:30",
      closeTime: "18:30",
    },
  ];

  return (
    <div className='branch-screen-wrapper'>
      <header>
        <img src='../../public/icons/b-menu.svg' alt='burger-menu' />
        <h2>Branches</h2>
        <img src='../../public/icons/bell_active_icon.svg' alt='' />
      </header>
      <div className='branch-screen'>
        <div
          className={`branch-view-toggle ${
            viewMode === "map" ? "map-mode" : ""
          }`}
        >
          <button
            className={viewMode === "list" ? "active" : ""}
            onClick={() => setViewMode("list")}
          >
            List
          </button>
          <button
            className={viewMode === "map" ? "active" : ""}
            onClick={() => setViewMode("map")}
          >
            Map
          </button>
        </div>
        {viewMode === "list" && (
          <div className='branch-list'>
            {branches.map((branch) => (
              <BranchCard
                key={branch.id}
                branch={branch}
                onClick={() => setSelectedBranchId(branch.id)}
                actionType='geo'
              />
            ))}
          </div>
        )}

        {viewMode === "map" && (
          <BranchMap
            branches={branches}
            selectedBranchId={selectedBranchId}
            onSelect={(id) => setSelectedBranchId(id)}
          />
        )}
      </div>
    </div>
  );
}
