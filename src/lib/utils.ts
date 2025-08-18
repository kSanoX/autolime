import { customFetch } from "@/utils/customFetch";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function updateAppointmentStatus(id: number, status: number) {
  const token = localStorage.getItem("access_token");
  const res = await customFetch(`${import.meta.env.VITE_API_URL}/appointments/${id}/edit`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("Failed to update status");
  return await res.json();
}