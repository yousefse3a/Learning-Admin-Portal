import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { registerSchoolAdmin } from "@/api/adminApis";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSchoolSearch } from "@/hooks/useSchoolSearch";

// Schema to validate the registration form
const FormSchema = z
  .object({
    schoolId: z.string().nonempty({ message: "School ID is required." }),
    name: z
      .string()
      .min(10, { message: "Name must be at least 10 characters." })
      .max(250, { message: "Name cannot exceed 250 characters." })
      .regex(/^[a-zA-Z0-9]+$/, {
        message:
          "Name must contain only letters and numbers, no spaces or special characters.",
      }),
    phone: z
      .string()
      .nonempty({ message: "Phone is required." })
      .min(10, { message: "Phone number must be at least 10 digits." })
      .max(12, { message: "Phone number cannot exceed 12 digits." }),
    email: z
      .string()
      .nonempty({ message: "Email is required." })
      .email({ message: "Invalid email address." }),
    gender: z.enum(["0", "1"], { message: "Gender is required." }), // 0 for Male, 1 for Female
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." })
      .max(100, { message: "Password cannot exceed 100 characters." }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm Password must be at least 6 characters." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

interface RegisterSchoolAdminFormProps {
  isEdit?: boolean;
  adminData?: any;
  onClose?: () => void;
}

export function RegisterSchoolAdminForm({
  isEdit = false,
  adminData = null,
  onClose,
}: RegisterSchoolAdminFormProps) {
  const { schools, isLoading, error: schoolError } = useSchoolSearch();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      schoolId: adminData?.SchoolId || "",
      name: adminData?.Name || "",
      phone: adminData?.Phone || "",
      email: adminData?.Email || "",
      gender: adminData?.Gender || "0",
      password: "",
      confirmPassword: "",
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoadingSubmit(true);
    try {
      const response = await registerSchoolAdmin({
        SchoolId: data.schoolId,
        Name: data.name,
        Phone: data.phone || "",
        Email: data.email || "",
        Gender: Number(data.gender),
        Password: data.password, // Include password
      });
      console.log("School Admin Registration successful", response);
      navigate("/dashboard/school-admins");
      if (onClose) onClose();
      setError(null);
    } catch (err: any) {
      console.error("Operation failed", err);
      setError(err.Message || "Operation failed");
    } finally {
      setIsLoadingSubmit(false);
    }
  }

  return (
    <div className="flex flex-col items-center w-full max-w-[70rem]">
      {error && (
        <Alert variant="destructive" className="w-full max-w-md mb-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full"
        >
          {/* School ID dropdown */}
          <FormField
            control={form.control}
            name="schoolId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School</FormLabel>
                <FormControl>
                  <select
                    className="w-full border rounded p-2 bg-gray-100 text-gray-900 mt-1"
                    {...field}
                    disabled={isLoading}
                  >
                    <option value="" disabled>
                      Select a school
                    </option>
                    {schools.map((school) => (
                      <option key={school.Id} value={school.Id}>
                        {school.NameEn}
                      </option>
                    ))}
                  </select>
                </FormControl>
                {isLoading && <p>Loading schools...</p>}
                {schoolError && <p className="text-red-500">{schoolError}</p>}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Name field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone field */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gender field */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <select
                    className="w-full border rounded p-2 bg-gray-100 text-gray-900 mt-1"
                    {...field}
                  >
                    <option value="0">Male</option>
                    <option value="1">Female</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit button */}
          <Button type="submit" className="w-full" disabled={isLoadingSubmit}>
            {isLoadingSubmit
              ? isEdit
                ? "Updating..."
                : "Adding..."
              : isEdit
              ? "Update"
              : "Add School Admin"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
