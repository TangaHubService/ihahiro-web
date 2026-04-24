'use client'

import {
  ChangeEvent,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useState,
  useRef,
} from 'react'
import { X, Loader2, Plus, ChevronDown } from 'lucide-react'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/lib/utils/cn'

export interface SelectOption {
  id: string
  name: string
}

interface SearchableSelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  onCreateOption?: (name: string) => Promise<SelectOption>
  onAfterCreate?: (option: SelectOption) => void
  placeholder?: string
  disabled?: boolean
  label?: string
  error?: string
  className?: string
  loading?: boolean
}

export const SearchableSelect = forwardRef<HTMLDivElement, SearchableSelectProps>(
  (
    {
      value,
      onChange,
      options,
      onCreateOption,
      onAfterCreate,
      placeholder = 'Search...',
      disabled = false,
      label,
      error,
      className,
      loading = false,
    },
    ref
  ) => {
    const id = useId()
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>([])
    const [isCreating, setIsCreating] = useState(false)
    const [showAddOption, setShowAddOption] = useState(false)
    const [newOptionName, setNewOptionName] = useState('')

    const debouncedQuery = useDebounce(searchQuery, 250)
    const inputId = `${id}-input`

    const selectedOption = options.find((opt) => opt.id === value)

    useEffect(() => {
      setFilteredOptions(options)
    }, [options])

    useEffect(() => {
      if (!debouncedQuery) {
        setFilteredOptions(options)
        setShowAddOption(false)
        return
      }

      const query = debouncedQuery.toLowerCase().trim()
      const filtered = options.filter((opt) =>
        opt.name.toLowerCase().includes(query)
      )

      setFilteredOptions(filtered)

      const exactMatch = options.some(
        (opt) => opt.name.toLowerCase() === query
      )

      setShowAddOption(!exactMatch && query.length > 0 && !!onCreateOption)
      setNewOptionName(debouncedQuery.trim())
    }, [debouncedQuery, options, onCreateOption])

    useOnClickOutside(containerRef, () => {
      setIsOpen(false)
    })

    const handleSelect = useCallback(
      (option: SelectOption) => {
        onChange(option.id)
        setSearchQuery('')
        setIsOpen(false)
        setShowAddOption(false)
      },
      [onChange]
    )

    const handleCreateOption = useCallback(async () => {
      if (!newOptionName || isCreating || !onCreateOption) return

      setIsCreating(true)
      try {
        const created = await onCreateOption(newOptionName)
        onChange(created.id)
        if (onAfterCreate) {
          onAfterCreate(created)
        }
        setSearchQuery('')
        setIsOpen(false)
        setShowAddOption(false)
      } catch {
      } finally {
        setIsCreating(false)
      }
    }, [newOptionName, onCreateOption, onAfterCreate, onChange])

    const handleClear = useCallback(() => {
      onChange('')
      setSearchQuery('')
      setIsOpen(false)
    }, [onChange])

    return (
      <div ref={ref} className={cn('relative', className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-[#1f2c21] mb-1.5"
          >
            {label}
          </label>
        )}

        <div
          ref={containerRef}
          className={cn(
            'relative rounded-xl border-2 transition-all duration-200',
            error
              ? 'border-red-400 bg-red-50/50'
              : isOpen
              ? 'border-primary ring-2 ring-primary/10 shadow-md'
              : 'border-[#d8ddd8] bg-white',
            disabled && 'opacity-60 cursor-not-allowed'
          )}
        >
          <div className="flex items-center">
            <div className="flex-1">
              <input
                ref={inputRef}
                id={inputId}
                type="text"
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setSearchQuery(e.target.value)
                  if (!isOpen) setIsOpen(true)
                }}
                onFocus={() => {
                  if (!disabled) setIsOpen(true)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsOpen(false)
                    inputRef.current?.blur()
                  } else if (e.key === 'Enter' && showAddOption) {
                    e.preventDefault()
                    handleCreateOption()
                  }
                }}
                disabled={disabled || loading}
                placeholder={selectedOption?.name || placeholder}
                className="w-full h-12 px-4 text-sm text-[#18251a] placeholder:text-[#939a95] outline-none bg-transparent"
                autoComplete="off"
              />
            </div>

            {value && (
              <button
                type="button"
                onClick={handleClear}
                disabled={disabled}
                className="p-1.5 text-[#7a837c] hover:text-[#18251a] transition-colors"
              >
                <X size={16} />
              </button>
            )}

            <div
              className={cn(
                'h-full px-3 flex items-center justify-center border-l-2 transition-colors',
                isOpen
                  ? 'border-[#d8ddd8] text-primary'
                  : 'border-transparent text-[#7a837c]'
              )}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <ChevronDown
                  size={18}
                  className={cn('transition-transform', isOpen && 'rotate-180')}
                />
              )}
            </div>
          </div>

          {isOpen && !disabled && (
            <div className="absolute z-50 left-0 right-0 mt-2 rounded-xl border-2 border-[#d8ddd8] bg-white shadow-xl max-h-80 overflow-y-auto">
              {filteredOptions.length === 0 && !showAddOption ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-[#7a837c]">No options found</p>
                </div>
              ) : (
                <div className="py-2">
                  {filteredOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={cn(
                        'w-full px-4 py-3 text-left text-sm transition-colors',
                        option.id === value
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-[#18251a] hover:bg-[#f5f7f5]'
                      )}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              )}

              {showAddOption && newOptionName && onCreateOption && (
                <div className="border-t-2 border-[#d8ddd8] py-2">
                  <button
                    type="button"
                    onClick={handleCreateOption}
                    disabled={isCreating || !newOptionName}
                    className={cn(
                      'w-full px-4 py-3 text-left text-sm flex items-center gap-2 transition-colors',
                      isCreating
                        ? 'bg-[#f5f7f5] text-[#7a837c]'
                        : 'text-primary hover:bg-primary/5 font-semibold'
                    )}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        <span>Add "{newOptionName}"</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

SearchableSelect.displayName = 'SearchableSelect'