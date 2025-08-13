import { customFetch } from "@/utils/customFetch";
import { useState } from "react";

type ActivationPayload = {
  plate: string;
  number_of_washes: number | "infinity";
  sub_term: number;
  renewal: boolean;
};

export function useActivatePackage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const activatePackage = async (payload: ActivationPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("access_token");
      const response = await customFetch(`${import.meta.env.VITE_API_URL}/packages/activate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to activate package");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { activatePackage, loading, error, success };
}
