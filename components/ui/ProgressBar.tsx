export function ProgressBar({
  value,
  max = 100,
  colorClassName = "bg-accent",
  label,
}: {
  value: number;
  max?: number;
  colorClassName?: string;
  label?: string;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full">
      {label ? (
        <div className="mb-1 flex items-center justify-between text-xs text-text-secondary">
          <span>{label}</span>
          <span>{Math.round(pct)}%</span>
        </div>
      ) : null}
      <div className="h-2 w-full overflow-hidden rounded-full bg-bg-panel-hover">
        <div
          className={`h-full rounded-full ${colorClassName} transition-[width] duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
