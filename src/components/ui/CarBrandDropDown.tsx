import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import "../../../src/styles/dropdowns/car-brands-dropdown.scss";

const BRANDS = [
  { name: "Alfa Romeo", letter: "A" },
  { name: "Aston Martin", letter: "A" },
  { name: "BMW", letter: "B" },
  { name: "Bentley", letter: "B" },
];

export function CarBrandDropDown({
  open,
  setOpen,
  applyBrand,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  applyBrand: (brand: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const groupedBrands = useMemo(() => {
    const filtered = BRANDS.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase())
    );
    const groups: Record<string, string[]> = {};
    filtered.forEach(({ name, letter }) => {
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(name);
    });
    return groups;
  }, [search]);

  if (!open) return null;

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

          <h3>Choose car brand</h3>

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
            {Object.entries(groupedBrands).map(([letter, brands]) => (
              <div key={letter} className='brand-group'>
                <div className='brand-letter'>
                  {letter} <hr />{" "}
                  <span className='count-brands'>{brands.length}</span>
                </div>
                {brands.map((brand) => (
                  <div
                    key={brand}
                    className={`brand-option ${
                      selectedBrand === brand ? "selected" : ""
                    }`}
                    onClick={() => setSelectedBrand(brand)}
                  >
                    {brand}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              if (selectedBrand) {
                applyBrand(selectedBrand);
                setOpen(false);
              }
            }}
            disabled={!selectedBrand}
            className={`submit-button ${selectedBrand ? "active" : "disabled"}`}
          >
            Select
          </button>
        </div>
      </motion.div>
    </>
  );
}
