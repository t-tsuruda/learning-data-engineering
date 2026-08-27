"use client";

import { CONFIDENCE_SCALE, type ConfidenceLevel } from "@/lib/domain/confidence";

export function ConfidencePicker({
  value,
  onChange,
  label,
}: {
  value?: ConfidenceLevel;
  onChange: (level: ConfidenceLevel) => void;
  label: string;
}) {
  return (
    <div>
      <p className="mb-2 text-sm text-text-secondary">{label}</p>
      <div className="flex flex-wrap gap-2">
        {CONFIDENCE_SCALE.map((c) => (
          <button
            key={c.level}
            type="button"
            onClick={() => onChange(c.level)}
            className={`flex flex-col items-center gap-1 rounded-md border px-3 py-2 text-xs transition-colors ${
              value === c.level
                ? "border-accent bg-accent/10 text-accent"
                : "border-border-strong text-text-secondary hover:border-accent/40"
            }`}
          >
            <span className="text-lg" aria-hidden>{c.emoji}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
