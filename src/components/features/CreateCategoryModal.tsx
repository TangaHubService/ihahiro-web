'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { categoriesApi, type Category } from '@/lib/api/products'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { getErrorMessage } from '@/lib/utils/getErrorMessage'
import { useToast } from '@/providers/ToastProvider'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

const PENDING_ACTION_KEY = 'pendingAddCategory'

type CreateCategoryModalProps = {
  open: boolean
  onClose: () => void
  onSuccess?: (category: Category) => void
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }
      reject(new Error('Could not read the selected image'))
    }
    reader.onerror = () => reject(new Error('Could not read the selected image'))
    reader.readAsDataURL(file)
  })
}

export function CreateCategoryModal({ open, onClose, onSuccess }: CreateCategoryModalProps) {
  const t = useTranslations('postHarvest')
  const tCommon = useTranslations('common')
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      setName('')
      setDescription('')
      setIsSubmitting(false)
    }
  }, [open])

  useEffect(() => {
    if (!isAuthenticated && open) {
      sessionStorage.setItem(PENDING_ACTION_KEY, 'true')
      onClose()
      router.push(`/login?redirect=${encodeURIComponent('/post-harvest')}`)
    }
  }, [isAuthenticated, open, onClose, router])

  async function handleSubmit() {
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      const newCategory = await categoriesApi.create({
        name: name.trim(),
        description: description.trim() || undefined,
      })

      queryClient.setQueryData<Category[]>(queryKeys.categories.all, (old?: Category[]) =>
        old ? [...old, newCategory] : [newCategory]
      )

      toast({
        variant: 'success',
        description: t('categoryCreated'),
      })

      onSuccess?.(newCategory)
      onClose()
    } catch (error) {
      toast({
        variant: 'error',
        description: getErrorMessage(error, t('categoryCreateError')),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Modal
      open={open}
      title={t('newCategoryModalTitle')}
      description={t('newCategoryModalBody')}
      onClose={onClose}
    >
      <div className="space-y-4">
        <Input
          label={t('categoryNameLabel')}
          placeholder={t('categoryNamePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <Input
          label={t('categoryDescriptionLabel')}
          placeholder={t('categoryDescriptionPlaceholder')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl border-[#cdd7cc] text-[#314034]"
            onClick={onClose}
          >
            {tCommon('cancel')}
          </Button>
          <Button
            type="button"
            className="h-11 rounded-xl px-5 font-bold"
            onClick={handleSubmit}
            disabled={!name.trim() || isSubmitting}
          >
            {isSubmitting ? tCommon('loading') : t('createCategory')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}