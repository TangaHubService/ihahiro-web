"use client";

import type { Listing } from "@/lib/types/listing";
import Image from "next/image";
import { useState } from "react";

export function ListingGallery({ listing }: { listing: Listing }) {
  const urls =
    listing.galleryUrls.length > 0 ? listing.galleryUrls : [listing.imageUrl];
  const [active, setActive] = useState(0);
  const main = urls[active] ?? listing.imageUrl;

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-surface">
        <Image
          src={main}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
      </div>
      {urls.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {urls.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative size-16 shrink-0 overflow-hidden rounded-lg border-2 bg-surface ${
                active === i ? "border-primary" : "border-transparent"
              }`}
            >
              <Image
                src={url}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
