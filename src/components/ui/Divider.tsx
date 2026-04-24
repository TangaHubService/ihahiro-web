'use client'

interface DividerProps {
  className?: string
  invert?: boolean
}

export default function Divider({
  className = '',
  invert = false,
}: DividerProps) {
  return (
    <div
      className={`${invert ? 'divider-curve-top' : 'divider-curve'} ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="w-full h-16 sm:h-24"
      >
        <path
          className={invert ? 'fill-white' : 'fill-[#f5f5f5]'}
          d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,75 1440,50 L1440,100 L0,100 Z"
        />
      </svg>
    </div>
  )
}

export function WaveDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`divider-curve ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="w-full h-12 sm:h-20"
      >
        <path fill="#f5f5f5" d="M0,40 Q360,100 720,40 T1440,40 V100 H0 Z" />
      </svg>
    </div>
  )
}
