"use client";

import { HTMLAttributes, ReactNode, forwardRef } from "react";
import { cn } from "../../lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "accent" | "success" | "warning" | "error";
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  className,
  children,
  variant = "default",
  interactive = false,
  padding = "md",
  ...props
}, ref) => {
  const baseClasses = "bg-surface rounded-lg shadow-card border transition-all duration-base";
  
  const variants = {
    default: "border-border-light",
    accent: "border-accent/20 bg-accent-light",
    success: "border-success/20 bg-success-light",
    warning: "border-warning/20 bg-warning-light",
    error: "border-error/20 bg-error-light"
  };

  const paddings = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };

  const interactiveClasses = interactive 
    ? "hover:border-primary/30 hover:shadow-card-hover cursor-pointer" 
    : "";

  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        paddings[padding],
        interactiveClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";
