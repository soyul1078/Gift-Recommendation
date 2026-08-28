"use client";

import { useState } from "react";

type GiftThumbnailProps = {
  imageUrl?: string;
  title: string;
  fallbackEmoji?: string;
  /** Result-list cards: cap height so two cards fit in one screen instead of scaling with card width. */
  compact?: boolean;
};

export function GiftThumbnail({ imageUrl, title, fallbackEmoji = "🎁", compact = false }: GiftThumbnailProps) {
  const [failed, setFailed] = useState(false);
  const sizeClass = compact ? "h-[200px] w-full" : "aspect-[4/3] w-full";

  if (imageUrl && !failed) {
    return (
      <div className={`flex items-center justify-center bg-white p-2 ${sizeClass}`}>
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-contain"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-tint to-zinc-100 ${sizeClass}`}>
      <span className="text-2xl" aria-hidden>
        {fallbackEmoji}
      </span>
    </div>
  );
}
