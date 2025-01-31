import { useEffect, useState, useCallback } from "react";
import { searchGrades } from "../api/adminApis";

interface Grade {
  Id: string;
  NameAr: string;
  NameEn: string;
}

export function useGradeSearch() {
  const [grades, setGrades] = useState<Grade[]>([]); // Initialize as an empty array
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGrades = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await searchGrades();

      // Check if response.Data.Data is an array
      if (Array.isArray(response.Data?.Data)) {
        setGrades(response.Data.Data); // Set the grades data
      } else {
        console.error("Expected an array but got:", response.Data?.Data);
        setGrades([]); // Set an empty array to avoid errors
        setError("Unexpected data format received.");
      }

      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch grades");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGrades(); // Fetch on mount
  }, [fetchGrades]);

  return { grades, isLoading, error, fetchGrades };
}
