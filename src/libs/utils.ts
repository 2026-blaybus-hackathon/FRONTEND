import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// className 병합 함수
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}