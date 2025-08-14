import { useEffect, useState } from "react";
import { customFetch } from "@/utils/customFetch";

type EnrichedCar = {
  id: number;
  plate: string;
  type: string;
  model: string;
  brand: string;
};

export function useFetchCars() {
  const [cars, setCars] = useState<EnrichedCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      const token = localStorage.getItem("access_token");

      try {
        const res = await customFetch(`${import.meta.env.VITE_API_URL}/mycars`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch cars");

        const data = await res.json();

        const enriched = data.cars.map((car: any) => ({
          id: car.id,
          plate: car.plate,
          type: car.model?.type ?? "Unknown",
          model: car.model?.name ?? "Unknown",
          brand: car.model?.brand?.name ?? "Unknown",
        }));

        setCars(enriched);
      } catch (err) {
        setError("Error loading vehicles");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  return { cars, loading, error };
}
