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
        className="h-16 w-16 rounded-lg object-cover"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="flex h-16 w-16 items-center justify-center">
      <span className="text-2xl" aria-hidden>
        {fallbackEmoji}
      </span>
    </div>
  );
}
