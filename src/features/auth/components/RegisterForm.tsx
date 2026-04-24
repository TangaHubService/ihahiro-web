'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from '@/i18n/navigation'
import { useAuth } from '@/hooks/useAuth'
import { getErrorMessage } from '@/lib/utils/getErrorMessage'
import {
  createRegisterSchema,
  type RegisterFormValues,
} from '@/features/auth/schemas'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/providers/ToastProvider'
import { CheckCircle2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { useForm, useWatch } from 'react-hook-form'

function getSafeRedirectPath(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/listings'
  }

  return value
}

export function RegisterForm() {
  const t = useTranslations('auth.register')
  const tRoles = useTranslations('auth.roles')
  const tValidation = useTranslations('auth.validation')
  const schema = createRegisterSchema(tValidation)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isRouting, startTransition] = useTransition()
  const { registerAsync, isRegisterPending } = useAuth()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      isBuyer: false,
      isSeller: false,
    },
  })

  const [isBuyer = false, isSeller = false] = useWatch({
    control,
    name: ['isBuyer', 'isSeller'],
  })

  async function onSubmit(values: RegisterFormValues) {
    try {
      await registerAsync({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone || undefined,
        password: values.password,
        isBuyer: values.isBuyer,
        isSeller: values.isSeller,
      })
      toast({
        variant: 'success',
        description: t('successToast'),
      })
      startTransition(() => {
        router.replace(getSafeRedirectPath(searchParams.get('redirect')))
      })
    } catch (error) {
      toast({
        variant: 'error',
        description: getErrorMessage(error, t('submitError')),
      })
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-5 md:grid-cols-2">
        <Input
          autoComplete="given-name"
          label={t('firstNameLabel')}
          placeholder={t('firstNamePlaceholder')}
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <Input
          autoComplete="family-name"
          label={t('lastNameLabel')}
          placeholder={t('lastNamePlaceholder')}
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          type="email"
          autoComplete="email"
          label={t('emailLabel')}
          placeholder={t('emailPlaceholder')}
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          autoComplete="tel"
          label={t('phoneLabel')}
          placeholder={t('phonePlaceholder')}
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <div>
        <p className="text-sm font-medium text-foreground">{t('rolesLabel')}</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label
            className={`flex cursor-pointer items-start gap-3  transition-colors ${
              isBuyer
                ? 'border-primary bg-[#eef5eb]'
                : 'border-[#dde5dc] bg-white hover:border-primary/40'
            }`}
          >
            <input
              type="checkbox"
              className="mt-1 size-4 accent-primary"
              {...register('isBuyer')}
            />
            <span className="block">
              <span className="block font-bold text-[#18301d]">
                {tRoles('buyerTitle')}
              </span>
            </span>
          </label>

          <label
            className={`flex cursor-pointer items-start gap-3  transition-colors ${
              isSeller
                ? 'border-primary bg-[#eef5eb]'
                : 'border-[#dde5dc] bg-white hover:border-primary/40'
            }`}
          >
            <input
              type="checkbox"
              className="mt-1 size-4 accent-primary"
              {...register('isSeller')}
            />
            <span className="block">
              <span className="block font-bold text-[#18301d]">
                {tRoles('sellerTitle')}
              </span>
            </span>
          </label>
        </div>
        {errors.isBuyer?.message ? (
          <p className="mt-2 text-sm text-accent" role="alert">
            {errors.isBuyer.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          type="password"
          autoComplete="new-password"
          label={t('passwordLabel')}
          placeholder={t('passwordPlaceholder')}
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          type="password"
          autoComplete="new-password"
          label={t('confirmPasswordLabel')}
          placeholder={t('confirmPasswordPlaceholder')}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </div>

      <div className="rounded-2xl bg-[#f4f8f2] px-4 py-4 text-sm text-[#475448]">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>{t('privacyNote')}</span>
        </div>
      </div>

      <Button
        type="submit"
        className="h-12 w-full rounded-xl text-base font-bold"
        disabled={isRegisterPending || isRouting}
      >
        {isRegisterPending || isRouting ? t('submitting') : t('submit')}
      </Button>
    </form>
  )
}
