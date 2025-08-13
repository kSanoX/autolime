import { useEffect, useState } from "react";
import { customFetch } from "@/utils/customFetch";

type EnrichedCar = {
  plate: string;
  id: number;
  type: string;
  model_id: number;
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
            "Accept": 'application/json',
          },
        });

        if (!res.ok) throw new Error("Failed to fetch cars");

        const data = await res.json();

        const enriched = await Promise.all(
          data.cars.map(async (car: any) => {
            const brandRes = await customFetch(
              `${import.meta.env.VITE_API_URL}/cars/brands/${car.model_id}/models`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            let type = "Unknown";
            if (brandRes.ok) {
              const brandData = await brandRes.json();
              type = brandData.brand?.name || "Unknown";
            }

            return {
              plate: car.plate,
              type,
              id: car.id,
              model_id: car.model_id,
            };
          })
        );

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
