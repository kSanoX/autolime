import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/hooks";
import { setCars } from "@/store/carSlice";
import { customFetch } from "@/utils/customFetch";
import type { Car } from "@/store/carSlice";

export function useFetchCars() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      const token = localStorage.getItem("access_token");

      try {
        const res = await customFetch(`${import.meta.env.VITE_API_URL}/api/mycars`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch cars");

        const data = await res.json();
        dispatch(setCars(data.cars));
      } catch (err) {
        setError("Error loading vehicles");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [dispatch]);

  return { loading, error };
}
