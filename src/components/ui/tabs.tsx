import * as React from "react";
import { cn } from "./cn";

interface TabsContextValue {
  value: string;
  setValue: (next: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

interface TabsProps {
  value: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  const handleSetValue = React.useCallback(
    (next: string) => {
      onValueChange?.(next);
    },
    [onValueChange]
  );

  const contextValue = React.useMemo(() => ({ value, setValue: handleSetValue }), [value, handleSetValue]);

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return <div className={cn("inline-flex items-center justify-center rounded-lg bg-slate-100 p-1", className)}>{children}</div>;
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className, children, ...props }, ref) => {
    const ctx = React.useContext(TabsContext);
    if (!ctx) throw new Error("TabsTrigger must be used within Tabs");

    const isActive = ctx.value === value;
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      props.onClick?.(event);
      if (!event.defaultPrevented) {
        ctx.setValue(value);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex min-w-[80px] items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-colors",
          isActive ? "bg-white text-slate-900 shadow" : "text-slate-600 hover:text-slate-900",
          className
        )}
        aria-pressed={isActive}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TabsTrigger.displayName = "TabsTrigger";
