import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getNestedValue(obj: Record<string, any>, path: string) {
  return path.split(".").reduce((current, key) => {
    if (Array.isArray(current) && !isNaN(Number(key))) {
      return current[Number(key)];
    } else if (current && typeof current === "object" && key in current) {
      return current[key];
    }
    return undefined;
  }, obj);
}
