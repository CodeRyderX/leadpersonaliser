export default function ProgressIndicator({ current, total }) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary">
        Processing lead {current} of {total}...
      </p>
      <div className="w-full bg-surface-raised rounded-full h-2 border border-border overflow-hidden">
        <div
          className="progress-fill h-2 bg-accent rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-text-muted">{Math.round(pct)}% complete</p>
    </div>
  );
}
