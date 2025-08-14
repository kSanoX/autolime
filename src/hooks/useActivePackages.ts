import { useState, useEffect } from 'react';
import { customFetch } from '@/utils/customFetch';

export interface Package {
  id: number;
  package: {
    id: number;
    car_type: string;
    count_washes: number;
    created_at: string | null;
    updated_at: string | null;
  };
  car: {
    id: number;
    user_id: number;
    model_id: number;
    plate: string;
    created_at: string;
    updated_at: string;
  };
  start_date: string;
  end_date: string;
  number_of_washes: number;
  used_washes: number;
  renewal: boolean;
}

export interface MyPackagesResponse {
  success: boolean;
  packages: Package[];
}

export const useMyPackages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await customFetch(`${import.meta.env.VITE_API_URL}/packages/my`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Ошибка загрузки: ${res.status}`);
        const data: MyPackagesResponse = await res.json();
        setPackages(data.packages ?? []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return { packages, isLoading, error };
};
