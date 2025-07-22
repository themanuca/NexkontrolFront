// src/components/ui/card-content.tsx
import { cn } from "../../lib/utils"; // Usando o alias
import { forwardRef, type HTMLAttributes } from "react";

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";