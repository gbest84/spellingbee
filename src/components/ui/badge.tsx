import * as React from "react";
import { cn } from "./cn";

type BadgeVariant = "default" | "secondary" | "outline";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-slate-900 text-white",
  secondary: "bg-slate-100 text-slate-700",
  outline: "border border-slate-300 text-slate-700"
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantKey = (variant ?? "default") as BadgeVariant;

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
          variantClasses[variantKey],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export type { BadgeProps };
