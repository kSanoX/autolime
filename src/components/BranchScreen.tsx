import { useEffect, useState } from "react";
import { BranchCard } from "./BranchCard";
import { BranchMap } from "./BranchMap";
import { useFetchBranches, type Branch } from "@/hooks/useFetchBranches";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { BranchFilterDropDown } from "./ui/BranchFilterDropDown";
import { fetchFilteredBranches } from "@/hooks/fetchFilteredBranches";

export default function BranchScreen() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const location = useLocation();
  const locationState = location.state as {
    selectedBranchId?: number;
    viewMode?: "map" | "list";
  } | null;
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [roundTheClockOnly, setRoundTheClockOnly] = useState(false);
  const [onlyOpen, setOnlyOpen] = useState(false);

  const appointments = useSelector(
    (state: RootState) => state.appointments.appointments
  );

  const activeBranchIds = appointments.map((a) => a.branchId);

  useEffect(() => {
    fetchFilteredBranches({
      selectedServices: [],
      onlyOpen: false,
      roundTheClockOnly: false,
    })
      .then(setBranches)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleApplyFilters = () => {
    setLoading(true);
    fetchFilteredBranches({
      selectedServices,
      onlyOpen,
      roundTheClockOnly,
    })
      .then(setBranches)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

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
        <button
          onClick={() => setFilterOpen(true)}
          className={`filter-button ${filterOpen ? "active" : ""}`}
        >
          <svg
            width='16'
            height='18'
            viewBox='0 0 16 18'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M10 9V16.88C10.04 17.18 9.94001 17.5 9.71001 17.71C9.61749 17.8027 9.50761 17.8762 9.38663 17.9264C9.26566 17.9766 9.13598 18.0024 9.00501 18.0024C8.87404 18.0024 8.74436 17.9766 8.62338 17.9264C8.50241 17.8762 8.39252 17.8027 8.30001 17.71L6.29001 15.7C6.18101 15.5933 6.09812 15.4629 6.04782 15.319C5.99751 15.175 5.98115 15.0213 6.00001 14.87V9H5.97001L0.210009 1.62C0.0476172 1.41153 -0.0256572 1.14726 0.00619692 0.88493C0.038051 0.622602 0.172444 0.383546 0.380009 0.22C0.570009 0.08 0.780009 0 1.00001 0H15C15.22 0 15.43 0.08 15.62 0.22C15.8276 0.383546 15.962 0.622602 15.9938 0.88493C16.0257 1.14726 15.9524 1.41153 15.79 1.62L10.03 9H10Z'
              fill='#183D69'
            />
          </svg>
        </button>
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

        {loading && <p>Loading branches...</p>}
        {error && <p className='error'>{error}</p>}

        {viewMode === "list" && (
          <div className='branch-list'>
            {branches.map((branch) => (
              <BranchCard
                key={branch.id}
                branch={branch}
                isActive={activeBranchIds.includes(branch.id)}
                onClick={() => setSelectedBranchId(branch.id)}
              />
            ))}
          </div>
        )}

        {viewMode === "map" && !loading && branches.length > 0 && (
          <BranchMap
            branches={branches}
            selectedBranchId={selectedBranchId}
            onSelect={(id) => setSelectedBranchId(id)}
          />
        )}
        <BranchFilterDropDown
          open={filterOpen}
          setOpen={setFilterOpen}
          selectedServices={selectedServices}
          setSelectedServices={setSelectedServices}
          roundTheClockOnly={roundTheClockOnly}
          setRoundTheClockOnly={setRoundTheClockOnly}
          onlyOpen={onlyOpen}
          setOnlyOpen={setOnlyOpen}
          onApplyFilters={handleApplyFilters}
        />
      </div>
    </div>
  );
}
