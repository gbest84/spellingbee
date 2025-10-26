import * as React from "react";
import { cn } from "./cn";

type ButtonVariant = "default" | "outline" | "ghost" | "secondary" | "pill";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-gradient-to-r from-brand-400 to-brand-600 text-white shadow-bubble hover:from-brand-500 hover:to-brand-700",
  outline: "border border-brand-200/70 bg-white text-brand-600 hover:bg-brand-50",
  ghost: "bg-transparent text-brand-500 hover:bg-brand-50",
  secondary: "bg-sunshine text-slate-900 shadow-bubble hover:bg-[#ffd86c]",
  pill: "bg-white/80 text-brand-600 shadow-bubble border border-white/70 hover:bg-white"
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 rounded-full px-4 text-xs",
  md: "h-10 rounded-full px-6 text-sm",
  lg: "h-12 rounded-full px-8 text-base"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variantKey = (variant ?? "default") as ButtonVariant;
    const sizeKey = (size ?? "md") as ButtonSize;

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-display font-medium uppercase tracking-wide transition-transform duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200/80 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-0.5",
          variantClasses[variantKey],
          sizeClasses[sizeKey],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export type { ButtonProps };
