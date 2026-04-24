'use client'

import { ChangeEvent, DragEvent, useEffect, useRef, useState, useTransition } from 'react'
import { LocationBar } from '@/components/features/LocationBar'
import { Link, useRouter } from '@/i18n/navigation'
import { useAuth } from '@/hooks/useAuth'
import { locationsApi } from '@/lib/api/locations'
import { listingMediaApi, listingsApi } from '@/lib/api/listings'
import { productsApi, unitsApi, categoriesApi, type Product, type Unit, type Category } from '@/lib/api/products'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { queryKeys } from '@/lib/queryKeys'
import { getErrorMessage } from '@/lib/utils/getErrorMessage'
import type { LocationCascadeValue } from '@/components/features/LocationCascade'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useQueryClient } from '@tanstack/react-query'
import { type AuthUser } from '@/lib/api/auth'
import {
  ArrowRight,
  CheckCircle2,
  ImageIcon,
  MessageCircle,
  Phone,
  Plus,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useToast } from '@/providers/ToastProvider'
import { CreateCategoryModal } from './CreateCategoryModal'

const MAX_PHOTOS = 6
const MAX_PHOTO_SIZE = 5 * 1024 * 1024
const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png'])

type PostHarvestFormValues = {
  categoryId: string
  productId: string
  quantity: string
  price: string
  unitId: string
  location: LocationCascadeValue
  description: string
  phone: string
  whatsapp: string
}

type SelectedPhoto = {
  id: string
  file: File
  previewUrl: string
}

function extractLocationId(location: LocationCascadeValue): string | undefined {
  if (location.villageId) return location.villageId
  if (location.cellId) return location.cellId
  if (location.sectorId) return location.sectorId
  if (location.districtId) return location.districtId
  if (location.provinceId) return location.provinceId
  return undefined
}

function formatNumber(value: string | number) {
  const numericValue = typeof value === 'number' ? value : Number(value)

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return '0'
  }

  return new Intl.NumberFormat('en').format(numericValue)
}

function buildPhotoId(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`
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

export function PostHarvestForm() {
  const t = useTranslations('postHarvest')
  const tCommon = useTranslations('common')
  const { user, isAuthenticated } = useAuth()
  const typedUser = user as AuthUser | undefined
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const photosRef = useRef<SelectedPhoto[]>([])
  const [isRouting, startTransition] = useTransition()

  const [form, setForm] = useState<PostHarvestFormValues>({
    categoryId: '',
    productId: '',
    quantity: '',
    price: '',
    unitId: '',
    location: {},
    description: '',
    phone: '',
    whatsapp: '',
  })
  const [products, setProducts] = useState<Product[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [photos, setPhotos] = useState<SelectedPhoto[]>([])
  const [locationLabel, setLocationLabel] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true)
  const [isDragActive, setIsDragActive] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showNewProductModal, setShowNewProductModal] = useState(false)
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false)
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [isCreatingProduct, setIsCreatingProduct] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newProductName, setNewProductName] = useState('')

  useEffect(() => {
    photosRef.current = photos
  }, [photos])

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl))
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadCatalog() {
      setIsLoadingCatalog(true)

      try {
        const [loadedProducts, loadedUnits, loadedCategories] = await Promise.all([
          productsApi.list(),
          unitsApi.list(),
          categoriesApi.list(),
        ])

        if (!isMounted) return

        setProducts(loadedProducts.filter((product) => product.isActive))
        setUnits(loadedUnits)
        setCategories(loadedCategories.filter((cat) => cat.isActive))

        setForm((current) => {
          if (current.unitId) return current

          const preferredUnit =
            loadedUnits.find((unit) => unit.slug.toLowerCase() === 'kg') ??
            loadedUnits.find((unit) => unit.shortName?.toLowerCase() === 'kg') ??
            loadedUnits[0]

          return {
            ...current,
            unitId: preferredUnit?.id ?? '',
          }
        })
      } catch {
        if (!isMounted) return
        setProducts([])
        setUnits([])
      } finally {
        if (isMounted) {
          setIsLoadingCatalog(false)
        }
      }
    }

    loadCatalog()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return

    const pendingAction = sessionStorage.getItem('pendingAddCategory')
    if (pendingAction === 'true') {
      sessionStorage.removeItem('pendingAddCategory')
      setShowNewCategoryModal(true)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!typedUser?.phone) return

    setForm((current) =>
      current.phone
        ? current
        : {
            ...current,
            phone: typedUser.phone ?? '',
          }
    )
  }, [typedUser?.phone])

  useEffect(() => {
    const selectedProduct = products.find((product) => product.id === form.productId)

    if (!selectedProduct?.unitId || selectedProduct.unitId === form.unitId) return

    setForm((current) => ({ ...current, unitId: selectedProduct.unitId ?? current.unitId }))
  }, [form.productId, form.unitId, products])

  useEffect(() => {
    const locationId = extractLocationId(form.location)
    let isMounted = true

    if (!locationId) {
      setLocationLabel('')
      return
    }

    locationsApi
      .getById(locationId)
      .then((location) => {
        if (isMounted) {
          setLocationLabel(location?.name ?? '')
        }
      })
      .catch(() => {
        if (isMounted) {
          setLocationLabel('')
        }
      })

    return () => {
      isMounted = false
    }
  }, [form.location])

  function patch(partial: Partial<PostHarvestFormValues>) {
    setForm((current) => ({ ...current, ...partial }))
  }

  function revokePhotos(items: SelectedPhoto[]) {
    items.forEach((photo) => URL.revokeObjectURL(photo.previewUrl))
  }

  function resetForm() {
    revokePhotos(photosRef.current)
    setPhotos([])
    setLocationLabel('')
    setForm({
      categoryId: '',
      productId: '',
      quantity: '',
      price: '',
      unitId:
        units.find((unit) => unit.slug.toLowerCase() === 'kg')?.id ??
        units.find((unit) => unit.shortName?.toLowerCase() === 'kg')?.id ??
        units[0]?.id ??
        '',
      location: {},
      description: '',
      phone: typedUser?.phone ?? '',
      whatsapp: '',
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function removePhoto(photoId: string) {
    setPhotos((current) => {
      const photoToRemove = current.find((photo) => photo.id === photoId)

      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.previewUrl)
      }

      return current.filter((photo) => photo.id !== photoId)
    })
  }

  function addFiles(fileList: File[]) {
    if (fileList.length === 0) return

    const remainingSlots = MAX_PHOTOS - photosRef.current.length

    if (remainingSlots <= 0) {
      toast({
        variant: 'error',
        description: t('photoLimitError', { count: MAX_PHOTOS }),
      })
      return
    }

    const validFiles: File[] = []

    for (const file of fileList) {
      if (!ACCEPTED_TYPES.has(file.type)) {
        toast({
          variant: 'error',
          description: t('photoTypeError'),
        })
        continue
      }

      if (file.size > MAX_PHOTO_SIZE) {
        toast({
          variant: 'error',
          description: t('photoSizeError'),
        })
        continue
      }

      validFiles.push(file)
    }

    const nextFiles = validFiles.slice(0, remainingSlots)

    if (validFiles.length > remainingSlots) {
      toast({
        variant: 'error',
        description: t('photoLimitError', { count: MAX_PHOTOS }),
      })
    }

    if (nextFiles.length === 0) return

    setPhotos((current) => [
      ...current,
      ...nextFiles.map((file) => ({
        id: buildPhotoId(file),
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ])
  }

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.target.files ?? []))
    event.target.value = ''
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragActive(false)
    addFiles(Array.from(event.dataTransfer.files))
  }

  async function handleCreateCategory(name: string) {
    if (!name.trim()) return

    setIsCreatingCategory(true)
    try {
      const newCategory = await categoriesApi.create({ name: name.trim() })
      if (!newCategory?.id) throw new Error('Invalid response')
      setCategories((current) => [...(current || []), newCategory])
      patch({ categoryId: newCategory.id, productId: '' })

      setShowNewCategoryModal(false)
      setNewCategoryName('')
      toast({
        variant: 'success',
        description: t('categoryCreated'),
      })
    } catch (error) {
      toast({
        variant: 'error',
        description: getErrorMessage(error, t('categoryCreateError')),
      })
    } finally {
      setIsCreatingCategory(false)
    }
  }

  async function handleCreateProduct(name: string) {
    if (!name.trim() || !form.categoryId) return

    setIsCreatingProduct(true)
    try {
      const newProduct = await productsApi.create({
        name: name.trim(),
        categoryId: form.categoryId,
      })
      if (!newProduct?.id) throw new Error('Invalid response')
      setProducts((current) => [...(current || []), newProduct])
      patch({ productId: newProduct.id })

      setShowNewProductModal(false)
      setNewProductName('')
      toast({
        variant: 'success',
        description: t('productCreated'),
      })
    } catch (error) {
      toast({
        variant: 'error',
        description: getErrorMessage(error, t('productCreateError')),
      })
    } finally {
      setIsCreatingProduct(false)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const locationId = extractLocationId(form.location)
    const selectedProduct = products.find((product) => product.id === form.productId)

    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    if (
      !form.categoryId ||
      !selectedProduct ||
      !form.unitId ||
      !locationId ||
      !form.quantity ||
      Number(form.quantity) <= 0 ||
      !form.price ||
      Number(form.price) <= 0 ||
      !form.phone.trim()
    ) {
      toast({
        variant: 'error',
        description: t('requiredFieldsError'),
      })
      return
    }

    setIsSubmitting(true)

    try {
      const listing = await listingsApi.create({
        title: selectedProduct.name,
        description: form.description.trim() || selectedProduct.name,
        price: Number(form.price),
        quantity: Number(form.quantity),
        unitId: form.unitId,
        productId: form.productId,
        locationId,
        status: 'PENDING_REVIEW',
      })

      for (const [index, photo] of photos.entries()) {
        const dataUrl = await readFileAsDataUrl(photo.file)

        await listingMediaApi.add({
          listingId: listing.id,
          url: dataUrl,
          type: 'image',
          order: index,
        })
      }

      await queryClient.invalidateQueries({ queryKey: queryKeys.listings.all })
      toast({
        variant: 'success',
        description: t('submitSuccess'),
      })

      startTransition(() => {
        router.push(`/listings/${listing.id}`)
      })
    } catch (error) {
      toast({
        variant: 'error',
        description: getErrorMessage(error, t('submitError')),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedProduct = products.find((product) => product.id === form.productId)
  const selectedUnit =
    units.find((unit) => unit.id === form.unitId) ??
    units.find((unit) => unit.id === selectedProduct?.unitId)
  const sellerName =
    [typedUser?.firstName, typedUser?.lastName].filter(Boolean).join(' ').trim() || tCommon('farmer')
  const quantityLabel = `${formatNumber(form.quantity)} ${selectedUnit?.shortName ?? tCommon('kg')}`
  const locationPreview = locationLabel || t('previewLocation')
  const previewImage = photos[0]?.previewUrl ?? ''
  const tips = ['tipPhoto', 'tipQuality', 'tipPrice', 'tipBuyer'] as const
  const isBusy = isSubmitting || isRouting

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(22rem,1fr)] lg:items-start">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#dfe5df] bg-white p-5 shadow-[0_18px_55px_rgba(21,45,25,0.05)] sm:p-7"
        >
          <div className="space-y-6">
            <section className="space-y-5">
              <h2 className="text-[1.65rem] font-black tracking-[-0.03em] text-[#18251a]">
                {t('sectionProduct')}
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-medium text-[#1f2c21]">
                      Product <span className="text-accent">*</span>
                    </label>
                  </div>
                  <input
                    value={form.productId}
                    onChange={(event) => patch({ productId: event.target.value })}
                    className="h-12 w-full rounded-xl border-2 border-[#d8ddd8] bg-white px-4 text-sm text-[#18251a] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-medium text-[#1f2c21]">
                      Category <span className="text-accent">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (!isAuthenticated) {
                          setShowLoginModal(true)
                          return
                        }
                        setShowNewCategoryModal(true)
                      }}
                      disabled={isLoadingCatalog}
                      className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                    >
                      <Plus className="size-4" />
                      Add new
                    </button>
                  </div>
                  <SearchableSelect
                    value={form.categoryId}
                    onChange={(categoryId) => {
                      patch({ categoryId, productId: '' })
                    }}
                    options={(categories || []).filter(Boolean).map((c) => ({ id: c.id, name: c.name }))}
                    placeholder="Select category"
                    disabled={isLoadingCatalog}
                    loading={isLoadingCatalog}
                    className="w-full"
                  />
                </div>
                  <label className="text-sm font-semibold text-[#1f2c21]">
                    {t('quantityLabel')} <span className="text-accent">*</span>
                  </label>
                  <input
                    value={form.quantity}
                    onChange={(event) => patch({ quantity: event.target.value })}
                    className="h-12 w-full rounded-xl border border-[#d8ddd8] bg-white px-4 text-sm text-[#18251a] outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/10"
                    placeholder={t('quantityPlaceholder')}
                    type="number"
                    min="1"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#1f2c21]">
                    {t('priceLabel')} <span className="text-accent">*</span>
                  </label>
                  <div className="relative">
                    <input
                      value={form.price}
                      onChange={(event) => patch({ price: event.target.value })}
                      className="h-12 w-full rounded-xl border border-[#d8ddd8] bg-white px-4 pr-20 text-sm text-[#18251a] outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/10"
                      placeholder={t('pricePlaceholder')}
                      type="number"
                      min="1"
                    />
<span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#7a837c]">
                      {tCommon('currency')}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#1f2c21]">
                  {t('locationLabel')} <span className="text-accent">*</span>
                </label>
                <div className="rounded-xl border border-[#d8ddd8] bg-white p-4">
                  <LocationBar value={form.location} onChange={(location) => patch({ location })} compact />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#1f2c21]">
                  {t('descriptionLabel')}
                </label>
                <div className="relative">
                  <textarea
                    value={form.description}
                    onChange={(event) => patch({ description: event.target.value })}
                    maxLength={200}
                    rows={4}
                    className="w-full resize-none rounded-xl border border-[#d8ddd8] bg-white px-4 py-3 text-sm text-[#18251a] outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/10 placeholder:text-[#939a95]"
                    placeholder={t('descriptionPlaceholder')}
                  />
                  <span className="absolute bottom-3 right-4 text-xs text-[#7a837c]">
                    {form.description.length}/200
                  </span>
                </div>
              </div>
            </section>

            <section className="space-y-4 border-t border-[#edf1ec] pt-6">
              <h2 className="text-[1.65rem] font-black tracking-[-0.03em] text-[#18251a]">
                {t('sectionPhotos')}
              </h2>
              <p className="text-sm text-[#657067]">{t('photosHelp')}</p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                multiple
                className="hidden"
                onChange={handleFileInputChange}
              />

              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault()
                  setIsDragActive(true)
                }}
                onDragLeave={() => setIsDragActive(false)}
                onDrop={handleDrop}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    fileInputRef.current?.click()
                  }
                }}
                className={`flex min-h-[5rem] items-center justify-center rounded-xl border-2 border-dashed px-6 py-6 text-center transition ${
                  isDragActive
                    ? 'border-primary bg-[#f4faf2]'
                    : 'border-[#c8d4cc] bg-[#fafefb]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-[#eaf2e7]">
                    <Upload className="size-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#18251a]">{t('uploadTitle')}</p>
                    <p className="mt-0.5 text-xs text-[#7d867f]">{t('uploadBody')}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                {Array.from({ length: MAX_PHOTOS }, (_, index) => {
                  const photo = photos[index]

                  if (photo) {
                    return (
                      <div
                        key={photo.id}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-[#d8ddd8] bg-[#f5f7f5]"
                      >
                        <Image
                          src={photo.previewUrl}
                          alt={photo.file.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(photo.id)}
                          className="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition group-hover:opacity-100"
                          aria-label={t('removePhotoAria')}
                        >
                          <X className="size-4" aria-hidden />
                        </button>
                      </div>
                    )
                  }

                  return (
                    <button
                      key={`empty-photo-${index}`}
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-[#c8d4cc] bg-white text-[#c8d4cc] transition hover:border-primary hover:text-primary"
                      aria-label={t('addPhotoAria')}
                    >
                      <Plus className="mx-auto size-5" />
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="space-y-4 border-t border-[#edf1ec] pt-6">
              <h2 className="text-[1.65rem] font-black tracking-[-0.03em] text-[#18251a]">
                {t('sectionContact')}
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#1f2c21]">
                    {t('phoneLabel')} <span className="text-accent">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#6c756e]" />
                    <input
                      value={form.phone}
                      onChange={(event) => patch({ phone: event.target.value })}
                      className="h-12 w-full rounded-xl border border-[#d8ddd8] bg-white pl-11 pr-4 text-sm text-[#18251a] outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/10 placeholder:text-[#939a95]"
                      placeholder={t('phonePlaceholder')}
                      type="tel"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#1f2c21]">
                    {t('whatsappLabel')}
                  </label>
                  <div className="relative">
                    <MessageCircle className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary" />
                    <input
                      value={form.whatsapp}
                      onChange={(event) => patch({ whatsapp: event.target.value })}
                      className="h-12 w-full rounded-xl border border-[#d8ddd8] bg-white pl-11 pr-4 text-sm text-[#18251a] outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/10 placeholder:text-[#939a95]"
                      placeholder={t('phonePlaceholder')}
                      type="tel"
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="flex flex-col-reverse gap-3 border-t border-[#edf1ec] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-xl border-[#8a958d] bg-white font-bold text-[#263228] hover:bg-[#f5f6f5]"
                onClick={resetForm}
              >
                {t('cancel')}
              </Button>

              <Button type="submit" className="h-12 gap-2 rounded-xl px-6 font-black" disabled={isBusy}>
                {isBusy ? t('submitting') : t('submitButton')}
                <ArrowRight className="size-5" aria-hidden />
              </Button>
            </div>
          </div>
        </form>

        <aside className="space-y-5">
          <section className="rounded-2xl bg-[#eef4ec] p-5">
            <h2 className="text-xl font-black text-primary">{t('previewTitle')}</h2>
            <div className="mt-6 rounded-xl bg-white p-4 shadow-[0_16px_40px_rgba(21,45,25,0.07)]">
              <div className="flex gap-4">
                <div className="relative flex size-36 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#ededed] text-[#6b716d]">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt={selectedProduct?.name ?? t('previewProductName')}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <ImageIcon className="size-10" aria-hidden />
                  )}
                </div>

                <div className="min-w-0 flex-1 py-2">
                  <h3 className="line-clamp-2 text-lg font-black text-[#1d281f]">
                    {selectedProduct?.name ?? t('previewProductName')}
                  </h3>
                  <p className="mt-3 flex items-center gap-2 text-sm text-[#5f6962]">
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#edf5ea] text-primary">
                      <CheckCircle2 className="size-3.5" aria-hidden />
                    </span>
                    {locationPreview}
                  </p>

                  <div className="mt-5 flex items-end justify-between gap-3">
                    <p className="text-xl font-black text-primary">
                      {formatNumber(form.price)} {tCommon('currency')} /{' '}
                      {selectedUnit?.shortName ?? tCommon('kg')}
                    </p>
                    <p className="text-sm text-[#4f5a52]">
                      {tCommon('quantity')}: {quantityLabel}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-sm text-[#3e493f]">
                    <span className="flex size-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,#edf7ea_0%,#dbead4_100%)] text-[0.68rem] font-black text-primary">
                      {sellerName
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0]?.toUpperCase())
                        .join('') || 'IH'}
                    </span>
                    <span className="truncate">
                      {t('previewSellerPrefix')}: {sellerName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-[#eef4ec] p-5">
            <h2 className="text-xl font-black text-primary">{t('tipsTitle')}</h2>
            <ul className="mt-5 space-y-4 text-sm text-[#4f5b52]">
              {tips.map((key) => (
                <li key={key} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl bg-[#eef4ec] p-5">
            <h2 className="text-xl font-black text-primary">{t('helpTitle')}</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#4f5b52]">{t('helpBody')}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/contact" className="inline-flex">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-md border-primary bg-transparent px-5 font-bold text-primary"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  {t('contactButton')}
                </Button>
              </Link>

              <Link href="/contact" className="inline-flex">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-md border-primary bg-transparent px-5 font-bold text-primary"
                >
                  <Phone className="size-4" aria-hidden />
                  {t('callButton')}
                </Button>
              </Link>
            </div>
          </section>
        </aside>
      </div>

      <div className="mt-3 flex items-center gap-4 rounded-xl bg-[#eef4ec] p-4">
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-white">
          <ShieldCheck className="size-7" aria-hidden />
        </span>
        <div>
          <p className="font-black text-primary">{t('securityTitle')}</p>
          <p className="text-sm text-[#4f5b52]">{t('securityBody')}</p>
        </div>
      </div>

      <Modal
        open={showLoginModal}
        title={t('loginModalTitle')}
        description={t('loginModalBody')}
        onClose={() => setShowLoginModal(false)}
      >
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl border-[#cdd7cc] text-[#314034]"
            onClick={() => setShowLoginModal(false)}
          >
            {t('cancel')}
          </Button>
          <Button
            type="button"
            className="h-11 rounded-xl px-5 font-bold"
            onClick={() => {
              sessionStorage.setItem('pendingAddCategory', 'true')
              setShowLoginModal(false)
              router.push(`/login?redirect=${encodeURIComponent('/post-harvest')}`)
            }}
          >
            {t('loginModalConfirm')}
          </Button>
        </div>
      </Modal>

      <Modal
        open={showNewCategoryModal}
        title={t('newCategoryModalTitle')}
        description={t('newCategoryModalBody')}
        onClose={() => {
          setShowNewCategoryModal(false)
          setNewCategoryName('')
        }}
      >
        <div className="space-y-4">
          <input
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleCreateCategory(newCategoryName)
              }
            }}
            className="h-12 w-full rounded-xl border border-[#d8ddd8] bg-white px-4 text-sm text-[#18251a] outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/10"
            placeholder={t('newCategoryPlaceholder')}
            autoFocus
          />
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl border-[#cdd7cc] text-[#314034]"
              onClick={() => {
                setShowNewCategoryModal(false)
                setNewCategoryName('')
              }}
            >
              {t('cancel')}
            </Button>
            <Button
              type="button"
              className="h-11 rounded-xl px-5 font-bold"
              onClick={() => handleCreateCategory(newCategoryName)}
              disabled={!newCategoryName.trim() || isCreatingCategory}
            >
              {isCreatingCategory ? tCommon('loading') : t('createCategory')}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={showNewProductModal}
        title={t('newProductModalTitle')}
        description={t('newProductModalBody')}
        onClose={() => {
          setShowNewProductModal(false)
          setNewProductName('')
        }}
      >
        <div className="space-y-4">
          <input
            value={newProductName}
            onChange={(event) => setNewProductName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleCreateProduct(newProductName)
              }
            }}
            className="h-12 w-full rounded-xl border border-[#d8ddd8] bg-white px-4 text-sm text-[#18251a] outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/10"
            placeholder={t('newProductPlaceholder')}
            autoFocus
          />
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl border-[#cdd7cc] text-[#314034]"
              onClick={() => {
                setShowNewProductModal(false)
                setNewProductName('')
              }}
            >
              {t('cancel')}
            </Button>
            <Button
              type="button"
              className="h-11 rounded-xl px-5 font-bold"
              onClick={() => handleCreateProduct(newProductName)}
              disabled={!newProductName.trim() || isCreatingProduct}
            >
              {isCreatingProduct ? tCommon('loading') : t('createProduct')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
