import { motion } from "framer-motion";

export function TypeWashingDropDown({
  open,
  setOpen,
  selectedType,
  applyType,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  selectedType: "washing" | "polishing" | "dry-cleaning" | "complex" | "";
  applyType: (type: "washing" | "polishing" | "dry-cleaning" | "complex") => void;
}) {
  if (!open) return null;

  const types = [
    { id: "washing", label: "Washing" },
    { id: "polishing", label: "Polishing" },
    { id: "dry-cleaning", label: "Dry cleaning" },
    { id: "complex", label: "Complex" },
  ];

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(24,61,105,0.5)",
          zIndex: 999,
          paddingTop: "16px",
        }}
      />
      <motion.div
        drag='y'
        dragMomentum={false}
        onDragEnd={(e, info) => {
          if (info.offset.y > 60) setOpen(false);
        }}
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          backgroundColor: "#fff",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          minHeight: "200px",
          overflowY: "auto",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
          cursor: "grab",
          padding: "16px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                height: "6px",
                width: "40px",
                borderRadius: "9999px",
                backgroundColor: "#D1D5DB",
                marginBottom: "16px",
              }}
            />
          </div>

          <h3
            style={{
              textAlign: "center",
              fontSize: "20px",
              fontWeight: 600,
              color: "#183D69",
              padding: "0px",
            }}
          >
            Choose service type
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              justifyItems: "start",
              alignItems: "center",
            }}
          >
            {types.map((type) => {
              const isSelected = selectedType === type.id;
              return (
                <div
                  key={type.id}
                  onClick={() => applyType(type.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "16px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#183D69",
                      padding: "12px",
                      borderRadius: "16px",
                      marginBottom: "8px",
                      
                    }}
                  >
                    <img
                      src="../../src/assets/icons/car-wash-type-icon.svg"
                      alt=""
                      width={24}
                      height={24}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: 500,
                      color: isSelected ? "#F7B233" : "#183D69",
                      marginLeft: "12px",
                      whiteSpace: "noWrap",
                    }}
                  >
                    {type.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
}
