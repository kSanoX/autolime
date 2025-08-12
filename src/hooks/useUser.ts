// hooks/useUser.ts
import { useEffect, useState } from "react";
import { customFetch } from "@/utils/customFetch";

const API_URL = import.meta.env.VITE_API_URL;

type RawUser = {
  id: number;
  name: string;
  surname: string;
  sex: "male" | "female";
  date_of_birth: string;
  phone: string;
  email: string;
  email_verified_at: string | null;
  role: number;
  created_at: string;
  updated_at: string;
};

type User = {
  id: number;
  firstName: string;
  lastName: string;
  sex: "male" | "female" | null;
  dateOfBirth: Date | null;
  phone: string;
  email: string;
  emailVerified: boolean;
  role: number;
  createdAt: Date;
  updatedAt: Date;
};

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError(new Error("No access token"));
      setLoading(false);
      return;
    }

    customFetch(`${API_URL}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch /me");
        return res.json();
      })
      .then((data: { success: boolean; user: RawUser }) => {
        const parsed: User = {
          id: data.user.id,
          firstName: data.user.name || "",
          lastName: data.user.surname || "",
          sex: data.user.sex ?? null,
          dateOfBirth: data.user.date_of_birth ? new Date(data.user.date_of_birth) : null,
          phone: data.user.phone || "",
          email: data.user.email || "",
          emailVerified: !!data.user.email_verified_at,
          role: data.user.role,
          createdAt: new Date(data.user.created_at),
          updatedAt: new Date(data.user.updated_at),
        };
        setUser(parsed);
      })      
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, error };
}
