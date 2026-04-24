'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Search } from 'lucide-react'
import { FormEvent, useState } from 'react'

export type SearchBarProps = {
  initialQuery?: string
  placeholder: string
  submitLabel: string
  onSearch: (query: string) => void
  className?: string
}

export function SearchBar({
  initialQuery = '',
  placeholder,
  submitLabel,
  onSearch,
  className = '',
}: SearchBarProps) {
  const [value, setValue] = useState(initialQuery)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSearch(value.trim())
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full flex-col gap-2 sm:flex-row sm:items-stretch ${className}`}
    >
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
          aria-hidden
        />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="pl-10"
        />
      </div>
      <Button type="submit" className="shrink-0 sm:w-auto">
        <Search className="size-4" aria-hidden />
        {submitLabel}
      </Button>
    </form>
  )
}
