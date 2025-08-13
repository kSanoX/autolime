import { useEffect, useState } from "react";
import { BranchCard } from "./BranchCard";
import { BranchMap } from "./BranchMap";
import { useFetchBranches } from "@/hooks/useFetchBranches";
import { useLocation } from "react-router-dom";

export default function BranchScreen() {
  const { branches, loading, error } = useFetchBranches();
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

  return (
    <div className='branch-screen-wrapper'>
      <header>
        <img src='../../public/icons/b-menu.svg' alt='burger-menu' />
        <h2>Branches</h2>
        <img src='../../public/icons/bell_active_icon.svg' alt='' />
      </header>

      <div className='branch-screen'>
        <div className={`branch-view-toggle ${viewMode === "map" ? "map-mode" : ""}`}>
          <button className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")}>
            List
          </button>
          <button className={viewMode === "map" ? "active" : ""} onClick={() => setViewMode("map")}>
            Map
          </button>
        </div>

        {loading && <p>Loading branches...</p>}
        {error && <p className='error'>{error}</p>}

        {viewMode === "list" && (
          <div className='branch-list'>
            {branches.map((branch) => (
              <BranchCard
                key={branch.id}
                branch={branch}
                onClick={() => setSelectedBranchId(branch.id.toString())}
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

