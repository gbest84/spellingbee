import * as React from "react";
import { cn } from "./cn";

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (value: boolean) => void;
  id?: string;
  className?: string;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    { checked = false, onCheckedChange, id, className }: SwitchProps,
    ref
  ) => {
    const toggle = () => onCheckedChange?.(!checked);

    return (
      <button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={toggle}
        className={cn(
          "relative inline-flex h-7 w-12 items-center rounded-full border-2 border-white/70 bg-white/80 p-0.5 shadow-card transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200/60 focus-visible:ring-offset-2",
          checked ? "bg-gradient-to-r from-brand-400 to-brand-600" : "bg-white/80",
          className
        )}
      >
        <span
          className={cn(
            "inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    );
  }
);

Switch.displayName = "Switch";
