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
      <img
        src={imageUrl}
        alt={title}
        className="aspect-[4/3] w-full object-cover"
        onError={() => setFailed(true)}
      />
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
