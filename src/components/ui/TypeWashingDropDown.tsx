import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { customFetch } from "@/utils/customFetch";

const API_URL = import.meta.env.VITE_API_URL;

export type Service = {
  id: number;
  name: string;
};

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  selectedService: Service | null;
  applyType: (service: Service) => void;
};

export function TypeWashingDropDown({
  open,
  setOpen,
  selectedService,
  applyType,
}: Props) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    const token = localStorage.getItem("access_token");
    if (!token) return;

    setLoading(true);
    setError("");

    customFetch(`${API_URL}/services-list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setServices(data.services);
        } else {
          setError("Failed to load services");
        }
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

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
        onClick={() => setOpen(false)}
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
          <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
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

          {loading ? (
            <p style={{ textAlign: "center", color: "#879AB1" }}>Loading...</p>
          ) : error ? (
            <p style={{ textAlign: "center", color: "red" }}>{error}</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              {services.map((service) => {
                const isSelected = selectedService?.id === service.id;
                return (
                  <div
                    key={service.id}
                    onClick={() => {
                      applyType(service);
                      setOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "16px",
                      cursor: "pointer",
                      padding: "8px",
                      backgroundColor: isSelected ? "#F7B23322" : "transparent",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#183D69",
                        padding: "12px",
                        borderRadius: "16px",
                      }}
                    >
                      <img
                        src='../../src/assets/icons/car-wash-type-icon.svg'
                        alt=''
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
                        whiteSpace: "nowrap",
                      }}
                    >
                      {service.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
