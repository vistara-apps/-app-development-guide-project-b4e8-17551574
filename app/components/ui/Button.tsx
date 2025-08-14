"use client";

import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "icon";
  size?: "xs" | "sm" | "md" | "lg";
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = "primary",
  size = "md",
  className,
  children,
  icon,
  iconPosition = "left",
  isLoading = false,
  fullWidth = false,
  disabled,
  ...props
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-fast ease-default rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary hover:bg-primary-dark text-white shadow-button hover:shadow-button-hover focus:ring-primary active:scale-95",
    secondary: "bg-surface hover:bg-surface-hover text-text-primary border border-border-medium shadow-button hover:shadow-button-hover focus:ring-primary active:scale-95",
    accent: "bg-accent hover:bg-accent-dark text-white shadow-button hover:shadow-button-hover focus:ring-accent active:scale-95",
    outline: "bg-transparent hover:bg-primary-light text-primary border border-primary focus:ring-primary active:scale-95",
    icon: "bg-transparent hover:bg-surface-hover text-primary p-2 focus:ring-primary active:scale-95"
  };

  const sizes = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg"
  };

  const widthClass = fullWidth ? "w-full" : "";
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        variant !== "icon" && sizes[size],
        widthClass,
        className
      )}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
          {children}
          {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
        </>
      )}
    </button>
  );
});

Button.displayName = "Button";
