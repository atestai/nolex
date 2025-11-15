import { useState, useCallback } from "react";

interface UseConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info" | "success";
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<UseConfirmDialogOptions>({
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const openDialog = useCallback((dialogOptions: UseConfirmDialogOptions) => {
    setOptions(dialogOptions);
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    if (!isLoading) {
      setIsOpen(false);
      options.onCancel?.();
    }
  }, [isLoading, options]);

  const handleConfirm = useCallback(async () => {
    setIsLoading(true);
    try {
      await options.onConfirm();
      setIsOpen(false);
    } catch (error) {
      console.error("Error in confirmation:", error);
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  return {
    isOpen,
    isLoading,
    options,
    openDialog,
    closeDialog,
    handleConfirm,
  };
};
