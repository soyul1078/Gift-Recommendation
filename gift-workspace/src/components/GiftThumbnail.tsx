"use client";

import { useState } from "react";

type GiftThumbnailProps = {
  imageUrl?: string;
  title: string;
  fallbackEmoji?: string;
};

export function GiftThumbnail({ imageUrl, title, fallbackEmoji = "🎁" }: GiftThumbnailProps) {
  const [failed, setFailed] = useState(false);

  if (imageUrl && !failed) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center bg-white p-2">
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
    <div className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-tint to-zinc-100">
      <span className="text-2xl" aria-hidden>
        {fallbackEmoji}
      </span>
    </div>
  );
}
