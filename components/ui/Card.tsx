import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-lg border border-border bg-bg-panel p-4 sm:p-5 ${className}`}
      {...props}
    />
  );
}
