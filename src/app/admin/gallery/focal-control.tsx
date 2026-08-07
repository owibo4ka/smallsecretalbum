"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateGalleryPhotoFocalAction } from "@/lib/gallery-actions";
import { FocalSliders } from "./focal-sliders";

type Status = "idle" | "dirty" | "saving" | "saved";

// The gallery's per-photo crop control: shared FocalSliders wired to persist the
// value (via a server action) when you release a slider. Drag to preview; it
// saves on release, showing a Saving…/Saved status so the auto-save is visible.
export function FocalControl({
  photoId,
  url,
  focalX,
  focalY,
}: {
  photoId: string;
  url: string;
  focalX: number;
  focalY: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [x, setX] = useState(focalX);
  const [y, setY] = useState(focalY);
  const [status, setStatus] = useState<Status>("idle");

  // The last values we persisted — used to skip no-op saves.
  const [savedX, setSavedX] = useState(focalX);
  const [savedY, setSavedY] = useState(focalY);

  function save() {
    if (x === savedX && y === savedY) return;
    setSavedX(x);
    setSavedY(y);
    setStatus("saving");
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", photoId);
      fd.set("focalX", String(x));
      fd.set("focalY", String(y));
      await updateGalleryPhotoFocalAction(fd);
      router.refresh();
      setStatus("saved");
    });
  }

  return (
    <div className="space-y-1">
      <FocalSliders
        url={url}
        x={x}
        y={y}
        onChangeX={(v) => {
          setX(v);
          setStatus("dirty");
        }}
        onChangeY={(v) => {
          setY(v);
          setStatus("dirty");
        }}
        onCommit={save}
        disabled={pending}
      />
      <p className="h-3 text-right text-[10px] leading-3">
        {status === "dirty" && (
          <span className="text-ink/40">Release the slider to save…</span>
        )}
        {status === "saving" && <span className="text-ink/50">Saving…</span>}
        {status === "saved" && <span className="text-green-600">Saved ✓</span>}
      </p>
    </div>
  );
}
