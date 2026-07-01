export type ToastType = "success" | "info" | "warning";

export type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
};

export type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};
