import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteReasonPopup from "../../DeleteReasonPopup";
import ManagerOrdersList from "./ManagerOrdersList";
import { updateAppointmentStatus } from "@/lib/utils";

type Filter = "New" | "Confirmed" | "Sheduled" | "All";

const filters: Filter[] = ["New", "Confirmed", "Sheduled", "All"];

export default function Booking() {
  const [activeStatus, setActiveStatus] = useState<Filter>("New");
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [deleteReason, setDeleteReason] = useState("");
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    setSelectedOrderId(id);
    setPopupVisible(true);
  };

  const confirmDelete = async () => {
    if (selectedOrderId !== null) {
      try {
        await updateAppointmentStatus(selectedOrderId, 3);
        console.log("Deleted order:", selectedOrderId);
      } catch (err) {
        console.error("Failed to delete:", err);
      }
    }
    setDeleteReason("");
    setPopupVisible(false);
    setSelectedOrderId(null);
  };  

  const handleReschedule = (id: number, date: string) => {
    navigate(`/reschedule/${id}`, {
      state: {
        selectedDate: date,
        orderId: id,
      },
    });
  };

  const handleConfirm = async (id: number) => {
    try {
      await updateAppointmentStatus(id, 1); 
      console.log("Confirmed order:", id);
    } catch (err) {
      console.error("Failed to confirm:", err);
    }
  };
  

  return (
    <div>
      <header style={{ textAlign: "center", justifyContent: "center" }}>
        Booking
      </header>

      <div className="reservation-staus-bar">
        <ul>
          {filters.map((label) => (
            <li
              key={label}
              onClick={() => setActiveStatus(label)}
              className={`status-bar-item ${
                activeStatus === label ? "active" : ""
              }`}
            >
              {label}
            </li>
          ))}
        </ul>
      </div>

      <ManagerOrdersList
        activeStatus={activeStatus}
        onDelete={handleDelete}
        onReschedule={handleReschedule}
        onConfirm={handleConfirm}
      />

      <DeleteReasonPopup
        visible={popupVisible}
        reason={deleteReason}
        setReason={setDeleteReason}
        onCancel={() => setPopupVisible(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
