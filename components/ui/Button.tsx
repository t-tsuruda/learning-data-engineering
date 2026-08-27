import type { ButtonHTMLAttributes } from "react";

const VARIANTS = {
  primary: "bg-accent text-bg hover:bg-accent-strong",
  secondary: "bg-bg-panel-hover text-text-primary border border-border-strong hover:border-accent/50",
  ghost: "text-text-secondary hover:text-text-primary hover:bg-bg-panel-hover",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS;
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
