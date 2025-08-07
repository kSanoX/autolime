import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import "../../../src/styles/dropdowns/car-model-dropdown.scss";

const MODELS_BY_BRAND: Record<string, string[]> = {
  "Alfa Romeo": ["Giulia", "Stelvio", "Tonale"],
  "Aston Martin": ["DB11", "Vantage", "DBX"],
  "BMW": ["X5", "X6", "M5", "i8"],
  "Bentley": ["Bentayga", "Continental GT", "Flying Spur"],
};

export function CarModelDropDown({
  open,
  setOpen,
  selectedBrand,
  applyModel,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  selectedBrand: string;
  applyModel: (model: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  const filteredModels = useMemo(() => {
    if (!selectedBrand) return [];
    const models = MODELS_BY_BRAND[selectedBrand] || [];
    return models.filter((m) =>
      m.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, selectedBrand]);

  if (!open || !selectedBrand) return null;

  return (
    <>
      <div className='add-car-overlay' />
      <motion.div
        drag='y'
        dragMomentum={false}
        onDragEnd={(e, info) => {
          if (info.offset.y > 60) setOpen(false);
        }}
        onUpdate={(latest) => {
          if (latest.y < 0) latest.y = 0;
        }}
        className='add-car-sheet'
      >
        <div className='add-car-sheet-content'>
          <div className='drag-bar'>
            <div />
          </div>

          <h3>Choose model of {selectedBrand}</h3>

          <div className='search-wrapper'>
            <input
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search...'
              className='brand-search'
            />
            <img src='src/assets/icons/search-icon.svg' alt='' />
          </div>

          <div className='brand-letter-group'>
            <div className='brand-letter' style={{whiteSpace: "noWrap"}}>
              {selectedBrand} <hr />{" "}
              <span className='count-brands'>{filteredModels.length}</span>
            </div>

            {filteredModels.map((model) => (
              <div
                key={model}
                className={`brand-option ${
                  selectedModel === model ? "selected" : ""
                }`}
                onClick={() => setSelectedModel(model)}
              >
                {model}
              </div>
            ))}

            {filteredModels.length === 0 && (
              <p style={{ color: "#999", paddingTop: "12px" }}>
                No models available for {selectedBrand}
              </p>
            )}
          </div>

          <button
            onClick={() => {
              if (selectedModel) {
                applyModel(selectedModel);
                setOpen(false);
              }
            }}
            disabled={!selectedModel}
            className={`submit-button ${selectedModel ? "active" : "disabled"}`}
          >
            Select
          </button>
        </div>
      </motion.div>
    </>
  );
}
