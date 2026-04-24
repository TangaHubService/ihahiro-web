'use client'

import { useEffect, useState } from 'react'

export function useDebounce(value: string, delayMs: number): string {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value)
    }, delayMs)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delayMs])

  return debounced
}