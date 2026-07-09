'use client'

import { LocationCascade, type LocationCascadeValue } from '@/components/features/LocationCascade'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from '@/i18n/navigation'
import { queryKeys } from '@/lib/queryKeys'
import { usersApi } from '@/lib/api/users'
import { extractLocationId } from '@/lib/utils/extractLocationId'
import { getErrorMessage } from '@/lib/utils/getErrorMessage'
import { useToast } from '@/providers/ToastProvider'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { ShieldCheck } from 'lucide-react'

export function ProfileForm() {
  const t = useTranslations('profile')
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace('/login?redirect=%2Fprofile')
    }
  }, [isAuthLoading, isAuthenticated, router])

  const { data: profile, isPending, isError } = useQuery({
    queryKey: queryKeys.profile.detail,
    queryFn: usersApi.getProfile,
    enabled: isAuthenticated,
  })

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [location, setLocation] = useState<LocationCascadeValue>({})

  useEffect(() => {
    if (!profile) return
    setFirstName(profile.firstName)
    setLastName(profile.lastName)
    setPhone(profile.phone ?? '')
    setWhatsapp(profile.whatsapp ?? '')
  }, [profile])

  const updateMutation = useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.profile.detail, updated)
      toast({ variant: 'success', description: t('saveSuccess') })
    },
    onError: (error) => {
      toast({ variant: 'error', description: getErrorMessage(error, t('saveError')) })
    },
  })

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const locationId = extractLocationId(location)
    updateMutation.mutate({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || undefined,
      whatsapp: whatsapp.trim() || undefined,
      locationId,
    })
  }

  if (isAuthLoading || !isAuthenticated || isPending) {
    return <div className="h-64 animate-pulse rounded-2xl bg-[#f2f5f1]" />
  }

  if (isError || !profile) {
    return <p className="text-sm text-accent">{t('loadError')}</p>
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-[#dfe5df] bg-white p-6">
      <div className="flex flex-wrap items-center gap-3">
        {profile.isBuyer ? <Badge className="bg-trust font-bold text-primary">{t('buyerBadge')}</Badge> : null}
        {profile.isSeller ? <Badge className="bg-trust font-bold text-primary">{t('sellerBadge')}</Badge> : null}
        <span className="inline-flex items-center gap-1.5 text-sm text-[#5a675c]">
          <ShieldCheck className="size-4" aria-hidden />
          {profile.isVerified ? t('verified') : t('notVerified')}
        </span>
      </div>

      <p className="text-sm text-[#5a675c]">{t('memberSince', { date: memberSince })}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{t('firstNameLabel')}</label>
          <Input value={firstName} onChange={(event) => setFirstName(event.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{t('lastNameLabel')}</label>
          <Input value={lastName} onChange={(event) => setLastName(event.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{t('emailLabel')}</label>
          <Input value={profile.email} disabled />
          <p className="text-xs text-[#8a938b]">{t('emailNote')}</p>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{t('phoneLabel')}</label>
          <Input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{t('whatsappLabel')}</label>
          <Input value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} type="tel" />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <LocationCascade
            label={t('locationLabel')}
            value={location}
            onChange={setLocation}
            placeholder={profile.location?.name ?? undefined}
          />
        </div>
      </div>

      <Button type="submit" disabled={updateMutation.isPending} className="h-11 rounded-xl px-6 font-bold">
        {updateMutation.isPending ? t('saving') : t('save')}
      </Button>
    </form>
  )
}
