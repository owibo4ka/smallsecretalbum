"use client";

/* eslint-disable @next/next/no-img-element */

// Presentational focal-point control: a tall phone-shaped live preview plus
// horizontal + vertical sliders (0–100%). It holds no state and does no saving
// — the parent owns the values. `onCommit` fires when a drag/keypress ends, so
// callers that persist per-change (the gallery) can save on release; form-based
// callers (the post editor) can ignore it and submit with the surrounding form.
export function FocalSliders({
  url,
  x,
  y,
  onChangeX,
  onChangeY,
  onCommit,
  disabled = false,
}: {
  url: string | null;
  x: number;
  y: number;
  onChangeX: (value: number) => void;
  onChangeY: (value: number) => void;
  onCommit?: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      {/* Live preview: a tall phone-shaped frame cover-cropped at the current
          point — mirrors how the photo fills the full-screen hero/header. */}
      <div className="relative aspect-[9/16] w-12 shrink-0 overflow-hidden rounded border border-ink/15 bg-ink/5">
        {url && (
          <img
            src={url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: `${x}% ${y}%` }}
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <label className="flex items-center gap-2 text-[11px] text-ink/60">
          <span className="w-3">↔</span>
          <input
            type="range"
            min={0}
            max={100}
            value={x}
            disabled={disabled}
            onChange={(e) => onChangeX(Number(e.target.value))}
            onPointerUp={onCommit}
            onKeyUp={onCommit}
            onBlur={onCommit}
            aria-label="Horizontal focal point"
            className="h-1 flex-1 accent-ink disabled:opacity-50"
          />
          <span className="w-8 tabular-nums text-right">{x}%</span>
        </label>
        <label className="flex items-center gap-2 text-[11px] text-ink/60">
          <span className="w-3">↕</span>
          <input
            type="range"
            min={0}
            max={100}
            value={y}
            disabled={disabled}
            onChange={(e) => onChangeY(Number(e.target.value))}
            onPointerUp={onCommit}
            onKeyUp={onCommit}
            onBlur={onCommit}
            aria-label="Vertical focal point"
            className="h-1 flex-1 accent-ink disabled:opacity-50"
          />
          <span className="w-8 tabular-nums text-right">{y}%</span>
        </label>
      </div>
    </div>
  );
}
