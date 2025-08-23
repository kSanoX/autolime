import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { customFetch } from "@/utils/customFetch";
import { setRole, setUser, type UserRole, type User } from "@/store/userSlice";

export function useUser() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError(new Error("No access token"));
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await customFetch(`${import.meta.env.VITE_API_URL}/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch /me");

        const data: { success: boolean; user: RawUser } = await res.json();

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
          enablePushWashAppointment: Boolean(data.user.enable_push_wash_appointment),
          enablePushRenewalSubscription: Boolean(data.user.enable_push_renewal_subscription),
          enablePushSpecialPromotions: Boolean(data.user.enable_push_special_promotions),
        };        

        dispatch(setUser(parsed));

        const roleMap: Record<number, UserRole> = {
          1: "manager",
          0: "customer",
        };

        const mappedRole = roleMap[data.user.role];
        if (mappedRole) {
          dispatch(setRole(mappedRole));
        } else {
          console.warn("Unknown role:", data.user.role);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  return { loading, error };
}
