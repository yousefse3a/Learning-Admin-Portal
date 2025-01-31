import { useEffect, useState, useCallback } from "react";
import { searchLevels } from "@/api/adminApis"; // Import your API function

interface Level {
  Id: string;
  NameAr: string;
  NameEn: string;
}

export function useLevelSearch() {
  const [levels, setLevels] = useState<Level[]>([]); // Initialize as an empty array
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLevels = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await searchLevels();

      // Check if response.Data.Data is an array
      if (Array.isArray(response.Data?.Data)) {
        setLevels(response.Data.Data); // Set the levels data
      } else {
        console.error("Expected an array but got:", response.Data?.Data);
        setLevels([]); // Set an empty array to avoid errors
        setError("Unexpected data format received.");
      }

      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch levels");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLevels(); // Fetch on mount
  }, [fetchLevels]);

  return { levels, isLoading, error, fetchLevels };
}
