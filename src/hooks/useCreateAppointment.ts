import { useState } from "react";
import { useDispatch } from "react-redux";
import { addAppointment } from "@/store/appointmentsSlice";
import { customFetch } from "@/utils/customFetch";

type CreateAppointmentPayload = {
  car_wash_id: number;
  date: string;
  time: string;
  branchName: string;
  branchAddress: string;
  type: string;
};

export function useCreateAppointment() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createAppointment = async (payload: CreateAppointmentPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("access_token");

      const response = await customFetch(`${import.meta.env.VITE_API_URL}/appointments/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          car_wash_id: payload.car_wash_id,
          date: payload.date,
          time: payload.time,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create appointment");
      }

      dispatch(
        addAppointment({
          branchId: payload.car_wash_id,
          branchName: payload.branchName,
          branchAddress: payload.branchAddress,
          date: payload.date,
          time: payload.time,
          type: payload.type,
        })
      );

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { createAppointment, loading, error, success };
}
