import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAppointments } from "@/store/appointmentsSlice";
import { customFetch } from "@/utils/customFetch";

export function useLoadAppointmentsFromBackend() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    customFetch(`${import.meta.env.VITE_API_URL}/myappointments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.appointments.map((a: any) => ({
          branchId: a.car_wash_id,
          date: a.date, // "2025-08-14"
          time: a.time.slice(0, 5), // "15:00"
          type: "Standard", // 👈 хардкод
          approved: a.approved,
        }));

        dispatch(setAppointments(mapped));
      })
      .catch((err) => {
        console.error("Failed to load appointments", err);
      });
  }, []);
}
