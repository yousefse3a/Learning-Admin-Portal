import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { addFileStudent, downloadTemplate } from "@/api/adminApis";
import { useSchoolSearch } from "@/hooks/useSchoolSearch";

// Validation schema using Zod
const FormSchema = z.object({
  schoolId: z.string().min(1, { message: "SchoolId is required" }),
  studentFile: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "A file must be selected" }),
});

export function AddFileStudentForm() {
  const [isTemplateDownloading, setIsTemplateDownloading] = useState(false);
  // Fetch schools using hooks
  const {
    schools,
    isLoading: isLoadingSchools,
    error: schoolError,
  } = useSchoolSearch();

  const handleTemplateDownload = async () => {
    setIsTemplateDownloading(true);
    try {
      await downloadTemplate();
      alert("Template downloaded successfully!");
    } catch (error) {
      console.error("Error downloading template:", error);
      alert("Failed to download template. Please try again.");
    } finally {
      setIsTemplateDownloading(false);
    }
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      schoolId: "",
      studentFile: undefined,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await addFileStudent(data.schoolId, data.studentFile);
      setSuccess(
        "File uploaded successfully! A new file with passwords has been downloaded."
      );
      console.log(response);
    } catch (err: any) {
      setError(err.message || "File upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-8 w-full mx-auto upload_file_form">
      {/* Column 1: Form */}
      <div className="flex flex-col items-start space-y-6">
        <h2 className="text-xl font-bold">File Template</h2>
        <Button
          onClick={handleTemplateDownload}
          disabled={isTemplateDownloading}
        >
          {isTemplateDownloading ? "Downloading..." : "Download Template"}
        </Button>
      </div>

      {/* Column 2: Upload Form */}
      <div>
        {error && (
          <Alert variant="destructive" className="w-full mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="w-full mb-4">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            {/* School ID field */}
            <FormField
              control={form.control}
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

            {/* File Upload field */}
            <FormField
              control={form.control}
              name="studentFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files
                          ? e.target.files[0]
                          : undefined;
                        field.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Upload File"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
