"use client";

import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      expand={false}
      duration={3500}
      toastOptions={{
        className: "text-sm",
        style: {
          borderRadius: "12px",
        },
      }}
    />
  );
}

