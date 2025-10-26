import * as React from "react";
import { cn } from "./cn";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

type HeaderProps = React.HTMLAttributes<HTMLDivElement>;
type TitleProps = React.HTMLAttributes<HTMLHeadingElement>;
type DescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;
type ContentProps = React.HTMLAttributes<HTMLDivElement>;
type FooterProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }: CardProps, ref) => (
    <div
      ref={ref}
      className={cn("card-pop", className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, HeaderProps>(
  ({ className, ...props }: HeaderProps, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-2 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className, ...props }: TitleProps, ref) => (
    <h3 ref={ref} className={cn("font-display text-xl font-semibold text-slate-900", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<HTMLParagraphElement, DescriptionProps>(
  ({ className, ...props }: DescriptionProps, ref) => (
    <p ref={ref} className={cn("text-sm text-slate-600", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, ContentProps>(
  ({ className, ...props }: ContentProps, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, FooterProps>(
  ({ className, ...props }: FooterProps, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";
