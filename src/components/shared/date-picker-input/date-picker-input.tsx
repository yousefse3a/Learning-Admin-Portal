import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const DatePickerInput = ({ name, control, label, rules, errors, defaultValue }) => (
  <div className="mb-2">
    <label htmlFor={name}>{label}</label>
    <div className="mt-2">
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field }) => (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(selectedDate) => field.onChange(selectedDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors[name] && (
              <p className="mt-1 text-[#ff3728] text-[14px] font-[300]">
                {errors[name]?.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  </div>
);

export default DatePickerInput;

