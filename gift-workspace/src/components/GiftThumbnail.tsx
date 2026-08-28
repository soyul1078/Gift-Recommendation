"use client";

import { useState } from "react";

type GiftThumbnailProps = {
  imageUrl?: string;
  title: string;
  fallbackEmoji?: string;
  /** Result-list cards: small fixed-size square thumbnail instead of a full-width aspect box. */
  thumb?: boolean;
};

export function GiftThumbnail({ imageUrl, title, fallbackEmoji = "🎁", thumb = false }: GiftThumbnailProps) {
  const [failed, setFailed] = useState(false);
  const sizeClass = thumb ? "h-[110px] w-[110px] flex-none rounded-xl" : "aspect-[4/3] w-full";

  if (imageUrl && !failed) {
    return (
      <div className={`flex items-center justify-center overflow-hidden bg-white p-2 ${sizeClass}`}>
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
    <div className={`flex items-center justify-center overflow-hidden bg-gradient-to-br from-tint to-zinc-100 ${sizeClass}`}>
      <span className="text-2xl" aria-hidden>
        {fallbackEmoji}
      </span>
    </div>
  );
}
