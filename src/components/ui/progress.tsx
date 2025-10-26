import * as React from "react";
import { cn } from "./cn";

type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: number;
  max?: number;
};

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const clamped = Math.min(Math.max(value, 0), max);
    const percentage = (clamped / max) * 100;

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-3 w-full overflow-hidden rounded-full border border-white/70 bg-gradient-to-r from-white/60 via-white/40 to-white/30 shadow-inner",
          className
        )}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        {...props}
      >
        <div
          className="h-full w-full origin-left rounded-full bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 shadow-[0_6px_12px_rgba(76,162,255,0.35)] transition-transform"
          style={{ transform: `scaleX(${percentage / 100})` }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";

export type { ProgressProps };
