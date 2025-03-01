import { useState, useEffect, useCallback } from "react";
import { GetSubject } from "@/api/services/exam.services";

interface Subject {
  Id: string;
  NameAr: string;
  NameEn: string;
}

export function useSubjectSearch() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await GetSubject({ Keyword: "", Page: 1, Size: 50 });

      if (Array.isArray(response.data?.Data?.Data)) {
        setSubjects(response.data.Data.Data);
      } else {
        console.error("Expected an array but got:", response.data?.Data?.Data);
        setSubjects([]);
        setError("Unexpected data format received.");
      }

      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch subjects");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return { subjects, isLoading, error, fetchSubjects };
}
