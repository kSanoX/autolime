import React, { useRef, useEffect, useState } from "react";
import MapView, { Marker } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import PinIcon from "../../public/images/branch-mark.png";
import { useNavigate } from "react-router-dom";
import type { Branch } from "@/hooks/useFetchBranches";
import { Source, Layer } from "@vis.gl/react-maplibre";


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
  const [routeGeoJSON, setRouteGeoJSON] = useState<any>(null);
  const selectedBranch = branches.find(
    (b) => b.id === Number(selectedBranchId)
  ) ?? branches[0];

  const handleRouteClick = async () => {
    if (!selectedBranch) return;
  
    const userLng = 44.8271;
    const userLat = 41.7151;
    
    const branchLng = 41.63613679685556;
    const branchLat = 41.61645736147081;
    try {
      const res = await fetch(
        `https://api.maptiler.com/navigation/v2/route?key=${import.meta.env.VITE_MAPTILER_KEY}&profile=driving&geometry=geojson&coordinates=${userLng},${userLat};${branchLng},${branchLat}`
      );
  
      const data = await res.json();
      if (data.routes?.[0]?.geometry) {
        setRouteGeoJSON(data.routes[0].geometry);
        mapRef.current?.map?.fitBounds(
          [
            [userLng, userLat],
            [branchLng, branchLat],
          ],
          { padding: 50 }
        );
      }
    } catch (err) {
      console.error("Failed to fetch route:", err);
    }
  };
  
  
  

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
    <div className='branch-map-wrapper'>
      <MapView
        ref={mapRef}
        initialViewState={{
          longitude: selectedBranch.lng,
          latitude: selectedBranch.lat,
          zoom: 12,
        }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${
          import.meta.env.VITE_MAPTILER_KEY
        }`}
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
            anchor='bottom'
            onClick={() => handleMarkerClick(branch)}
          >
            <img
              src={PinIcon}
              alt='marker'
              style={{ width: 52, height: 56, cursor: "pointer" }}
            />
          </Marker>
        ))}
        {routeGeoJSON && (
          <Source
            id='route'
            type='geojson'
            data={{
              type: "Feature",
              geometry: routeGeoJSON,
            }}
          >
            <Layer
              id='route-line'
              type='line'
              paint={{
                "line-color": "#17BA68",
                "line-width": 4,
              }}
            />
          </Source>
        )}
      </MapView>

      {selectedBranch && (
        <div className='branch-info-panel visible'>
          <div className='branch-info-panel__content'>
            <div>
              <h3 className='branch-info-panel__title'>
                {selectedBranch.name}
              </h3>
              <p className='branch-info-panel__text'>
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
                className='branch-info-panel__status'
              >
                {selectedBranch.isOpen ? "Open" : "Close"}
              </p>
            </div>
          </div>

          <p className='branch-info-panel__schedule'>
            Mn – Fr <span>9:00 –17:00</span>
            St – Sn <span>11:00 – 15:00</span>
          </p>

          <div className='branch-info-panel__actions'>
          <a href={`tel:+${selectedBranch.manager.phone}`}>
            <button>
              <img
                src='../../src/assets/icons/ManagerOrder/call_icon.svg'
                alt='call'
              />
            </button>
            </a>
            <button onClick={handleRouteClick}>
              <img src='../../src/assets/icons/path-icon.svg' alt='path' />
            </button>
            <button onClick={handleAppointmentClick}>
              <img
                src='../../src/assets/icons/calendar-icon-yellow.svg'
                alt='calendar'
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
