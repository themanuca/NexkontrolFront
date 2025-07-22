// src/components/ui/dialog.tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import React from "react";

// Adicione as props 'open' e 'onOpenChange' à interface do Dialog
interface DialogProps extends DialogPrimitive.DialogProps {}

export function Dialog({ children, ...props }: DialogProps) { // Receba as props
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>; // Passe as props para o Root
}

export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogContent = ({ children }: { children: React.ReactNode }) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
    <DialogPrimitive.Content
      className={cn(
        "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 rounded-xl dark:bg-gray-900 dark:border-gray-700",
        "max-h-[90vh] overflow-y-auto"
      )}
    >
      {children}
      <DialogPrimitive.Close className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
        <X className="h-5 w-5" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);