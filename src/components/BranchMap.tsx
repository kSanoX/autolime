import React, { useRef, useEffect } from "react";
import MapView, { Marker } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import PinIcon from "../../public/images/branch-mark.png";
import { useNavigate } from "react-router-dom";
import type { Branch } from "@/hooks/useFetchBranches"; // или лучше из "@/types/branch"


type BranchMapProps = {
  branches: Branch[];
  selectedBranchId: number | null;
  onSelect: (id: number | null) => void;
};

export function BranchMap({
  branches,
  selectedBranchId,
  onSelect,
}: BranchMapProps) {
  const mapRef = useRef<any>(null);
  const navigate = useNavigate();

  const selectedBranch = branches.find(
    (b) => b.id === Number(selectedBranchId)
  ) ?? branches[0];  
  

  const handleMarkerClick = (branch: Branch) => {
    onSelect(branch.id);
    if (mapRef.current?.map) {
      mapRef.current.map.flyTo({
        center: [branch.lng, branch.lat],
        zoom: 15,
        essential: true,
      });
    }
  };

  const handleAppointmentClick = () => {
    if (selectedBranch) {
      navigate("/wash-appointment", {
        state: {
          selectedBranchId: selectedBranch.id
        },
      });
    }
  };

  useEffect(() => {
    document.body.classList.toggle("map-locked", !!selectedBranch);
    return () => {
      document.body.classList.remove("map-locked");
    };
  }, [selectedBranch]);

  return (
    <div className="branch-map-wrapper">
      <MapView
        ref={mapRef}
        initialViewState={{
          longitude: selectedBranch.lng,
          latitude: selectedBranch.lat,
          zoom: 12,
        }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`}
        style={{ width: "100%", height: "85vh" }}
        attributionControl={false}
        scrollZoom={{ around: "center" }}
        dragPan={true}
        touchZoomRotate={true}
        doubleClickZoom={false}
      >
        {branches.map((branch) => (
          <Marker
            key={branch.id}
            longitude={branch.lng}
            latitude={branch.lat}
            anchor="bottom"
            onClick={() => handleMarkerClick(branch)}
          >
            <img
              src={PinIcon}
              alt="marker"
              style={{ width: 52, height: 56, cursor: "pointer" }}
            />
          </Marker>
        ))}
      </MapView>

      {selectedBranch && (
        <div className="branch-info-panel visible">
          <div className="branch-info-panel__content">
            <div>
              <h3 className="branch-info-panel__title">
                {selectedBranch.name}
              </h3>
              <p className="branch-info-panel__text">
                {selectedBranch.address}
              </p>
            </div>
            <div>
              <p
                style={{
                  backgroundColor: selectedBranch.isOpen
                    ? "#17BA68"
                    : "#BA1717",
                }}
                className="branch-info-panel__status"
              >
                {selectedBranch.isOpen ? "Open" : "Close"}
              </p>
            </div>
          </div>

          <p className="branch-info-panel__schedule">
            Mn – Fr <span>9:00 –17:00</span>
            St – Sn <span>11:00 – 15:00</span>
          </p>

          <div className="branch-info-panel__actions">
            <button>
              <img
                src="../../src/assets/icons/ManagerOrder/call_icon.svg"
                alt="call"
              />
            </button>
            <button>
              <img
                src="../../src/assets/icons/path-icon.svg"
                alt="path"
              />
            </button>
            <button onClick={handleAppointmentClick}>
              <img
                src="../../src/assets/icons/calendar-icon-yellow.svg"
                alt="calendar"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
