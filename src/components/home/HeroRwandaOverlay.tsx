import { MapPin } from "lucide-react";

export function HeroRwandaOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 md:p-10"
      aria-hidden
    >
      <svg
        viewBox="0 0 120 200"
        className="h-[min(72%,320px)] w-auto text-secondary drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Rwanda</title>
        <path
          d="M58 12 L78 16 L92 28 L98 48 L96 72 L88 96 L82 128 L74 158 L58 182 L42 168 L28 138 L22 108 L20 78 L28 48 L40 24 Z"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinejoin="round"
          strokeLinecap="round"
          className="text-[#2E7D32]"
        />
      </svg>
      <div className="absolute left-[54%] top-[38%] -translate-x-1/2 -translate-y-1/2 md:left-[52%] md:top-[40%]">
        <div className="flex size-11 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-white/90 md:size-12">
          <MapPin
            className="size-6 text-primary md:size-7"
            fill="currentColor"
            stroke="white"
            strokeWidth={0.5}
          />
        </div>
      </div>
    </div>
  );
}
