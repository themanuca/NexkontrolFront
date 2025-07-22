// components/ui/card.tsx
import { cn } from "../../lib/utils";
import { forwardRef, type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border bg-white shadow p-4 dark:bg-gray-900 dark:border-gray-700",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";
