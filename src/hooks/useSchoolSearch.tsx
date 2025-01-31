import { useEffect, useState, useCallback } from "react";
import { searchSchools } from "@/api/adminApis";

interface School {
  Id: string;
  NameAr: string;
  NameEn: string;
}

export function useSchoolSearch() {
  const [schools, setSchools] = useState<School[]>([]); // Initialize as an empty array
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchools = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await searchSchools();
      
      // Check if response.Data.Data is an array
      if (Array.isArray(response.Data?.Data)) {
        setSchools(response.Data.Data); // Set the schools data
      } else {
        console.error("Expected an array but got:", response.Data?.Data);
        setSchools([]); // Set an empty array to avoid errors
        setError("Unexpected data format received.");
      }

      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch schools");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchools(); // Fetch on mount
  }, [fetchSchools]);

  return { schools, isLoading, error, fetchSchools };
}
