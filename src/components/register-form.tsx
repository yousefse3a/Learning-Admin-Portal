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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerAccount, updateAccount } from "@/api/adminApis"; // Import the API call function
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Schema to validate the registration form
const FormSchema = z.object({
  name: z
    .string()
    .min(10, { message: "Name must be at least 10 characters." })
    .max(250, { message: "Name cannot exceed 250 characters." })
    .refine((data) => !data.includes(" "), {
      message: "Ussername cannot contain spaces.",
    }),
  email: z
    .string()
    .nonempty({ message: "Email is required." })
    .email({ message: "Invalid email address." }),
  phone: z
    .string()
    .nonempty({ message: "Phone is required." })
    .min(10, { message: "Phone number must be at least 10 digits." })
    .max(12, { message: "Phone number cannot exceed 12 digits." }),
  birthDate: z.string().optional(),

  gender: z.enum(["0", "1"], { message: "Gender is required." }),
});

interface RegisterFormProps {
  isEdit?: boolean; // true if editing, false if adding
  adminData?: any; // The data of the admin being edited (optional)
  onClose?: () => void; // Callback to close the modal
}

export function RegisterForm({
  isEdit = false,
  adminData = null,
  onClose,
}: RegisterFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: adminData?.Name || "",
      phone: adminData?.Phone || "",
      email: adminData?.Email || "",
      birthDate: adminData?.BirthDate
        ? new Date(adminData.BirthDate).toISOString()
        : "",
      gender: adminData?.Gender || "0", // Default to Male
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      if (isEdit) {
        // Handle edit (update)
        const response = await updateAccount({
          id: adminData?.Id || "", // Pass the existing admin ID for update
          name: data.name,
          phone: data.phone || "",
          email: data.email || "",
          birthDate: data.birthDate
            ? new Date(data.birthDate).toISOString()
            : "",
          gender: Number(data.gender),
        });
        console.log("Update successful", response);
      } else {
        // Handle add (register)
        const response = await registerAccount({
          name: data.name,
          phone: data.phone || "",
          email: data.email || "",
          birthDate: data.birthDate
            ? new Date(data.birthDate).toISOString()
            : "",
          gender: Number(data.gender),
        });
        console.log("Registration successful", response);
      }
      setError(null);
      if (onClose) onClose();
      navigate("/dashboard/users");
    } catch (err: any) {
      if (err.Message) {
        setError(err.Message);
      } else {
        setError("Operation failed");
      }
      console.error("Error occurred:", err);
    } finally {
      setIsLoading(false);
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
          {/* Name field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter name"
                    {...field}
                    autoComplete="off"
                  />
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
                  <Input
                    placeholder="Enter phone number"
                    {...field}
                    autoComplete="off"
                  />
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
                  <Input
                    type="email"
                    placeholder="Enter email"
                    {...field}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex space-x-4">
            {/* Birth Date field */}
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel className="block">Birth Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date) =>
                        form.setValue(
                          "birthDate",
                          date ? date.toISOString() : ""
                        )
                      }
                      placeholderText={"Select date"}
                      className="w-full border rounded p-2 bg-gray-100 text-gray-900 mt-1"
                    />
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
                <FormItem className="w-1/2">
                  <FormLabel className="block">Gender</FormLabel>
                  <FormControl>
                    <select
                      className="w-full border rounded p-2 bg-gray-100 text-gray-900 mt-1"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <option value="0">Male</option>
                      <option value="1">Female</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? isEdit
                ? "Updating..."
                : "Adding New User..."
              : isEdit
              ? "Update Admin"
              : "Add Admin"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
