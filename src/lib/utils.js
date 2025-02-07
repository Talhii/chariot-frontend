import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function showErrorToast(message) {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    draggable: true,
    progress: undefined,
  });
}

export function showSuccessToast(message) {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    draggable: true,
    progress: undefined,
  });
}