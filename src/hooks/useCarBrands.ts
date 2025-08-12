// hooks/useCarBrands.ts
import { useEffect, useState } from "react";
import { customFetch } from "@/utils/customFetch";
import type { Brand } from "@/store/carSlice";

const API_URL = import.meta.env.VITE_API_URL;

export function useCarBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError(new Error("No access token"));
      setLoading(false);
      return;
    }

    customFetch(`${API_URL}/cars/brands`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch brands");
        return res.json();
      })
      .then((data) => setBrands(data.brands))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { brands, loading, error };
}
