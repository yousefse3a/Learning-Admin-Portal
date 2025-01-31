import { useState } from "react";
import { Button } from "@/components/ui/button";
import { downloadStudentsFile } from "@/api/adminApis";
import { useForm, FormProvider } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSchoolSearch } from "@/hooks/useSchoolSearch";
import { useGradeSearch } from "@/hooks/useGradesSearch";

export function StudentFilePage() {
  const methods = useForm(); // Use React Hook Form's `useForm`
  const { watch } = methods;
  const [isStudentFileDownloading, setIsStudentFileDownloading] =
    useState(false);

  // Fetch schools and grades using hooks
  const {
    schools,
    isLoading: isLoadingSchools,
    error: schoolError,
  } = useSchoolSearch();
  const {
    grades,
    isLoading: isLoadingGrades,
    error: gradeError,
  } = useGradeSearch();

  const selectedGrade = watch("gradeId");
  const selectedSchool = watch("schoolId");

  // Handle student file download
  const handleStudentFileDownload = async () => {
    if (!selectedSchool || !selectedGrade) {
      alert("Please select a school and grade before downloading.");
      return;
    }

    setIsStudentFileDownloading(true);
    try {
      await downloadStudentsFile(selectedGrade, selectedSchool); // Download API call
      alert("Student file downloaded successfully!");
    } catch (error) {
      console.error("Error downloading student file:", error);
      alert("Failed to download student file. Please try again.");
    } finally {
      setIsStudentFileDownloading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 download_file_form">
        {/* Column 1: Select Filters */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Select Filters</h2>

          {/* Grade ID field */}
          <FormField
            control={methods.control}
            name="gradeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade</FormLabel>
                <FormControl>
                  {isLoadingGrades ? (
                    <div>Loading grades...</div> // Loading state
                  ) : gradeError ? (
                    <div className="text-red-500">{gradeError}</div> // Error state
                  ) : (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {grades?.map((grade) => (
                          <SelectItem key={grade.Id} value={grade.Id}>
                            {grade.NameEn} {/* Display English name */}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* School ID field */}
          <FormField
            control={methods.control}
            name="schoolId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School</FormLabel>
                <FormControl>
                  {isLoadingSchools ? (
                    <div>Loading schools...</div> // Loading state
                  ) : schoolError ? (
                    <div className="text-red-500">{schoolError}</div> // Error state
                  ) : (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select School" />
                      </SelectTrigger>
                      <SelectContent>
                        {schools?.map((school) => (
                          <SelectItem key={school.Id} value={school.Id}>
                            {school.NameEn} {/* Display English name */}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Download Student File Button */}
          <Button
            onClick={handleStudentFileDownload}
            disabled={
              isStudentFileDownloading || !selectedGrade || !selectedSchool
            }
          >
            {isStudentFileDownloading
              ? "Downloading..."
              : "Download Student File"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
