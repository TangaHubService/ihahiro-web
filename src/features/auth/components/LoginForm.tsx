'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from '@/i18n/navigation'
import { useAuth } from '@/hooks/useAuth'
import { getErrorMessage } from '@/lib/utils/getErrorMessage'
import {
  createLoginSchema,
  type LoginFormValues,
} from '@/features/auth/schemas'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/providers/ToastProvider'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Mail, Phone } from 'lucide-react'

function getSafeRedirectPath(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/listings'
  }
  return value
}

function detectIdentifierType(value: string): 'email' | 'phone' {
  if (value.includes('@')) return 'email'
  return 'phone'
}

export function LoginForm() {
  const t = useTranslations('auth.login')
  const tValidation = useTranslations('auth.validation')
  const schema = createLoginSchema(tValidation)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isRouting, startTransition] = useTransition()
  const { loginAsync, isLoginPending } = useAuth()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  })

  const identifierValue = watch('identifier')
  const identifierType = detectIdentifierType(identifierValue)

  async function onSubmit(values: LoginFormValues) {
    try {
      await loginAsync(values)
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
      <div className="space-y-1.5">
        <Input
          type="text"
          autoComplete="identifier"
          label={t('identifierLabel')}
          placeholder={t('identifierPlaceholder')}
          error={errors.identifier?.message}
          {...register('identifier')}
        />
        {identifierValue && !errors.identifier?.message && (
          <div className="flex items-center gap-1.5 text-xs text-[#6b7280]">
            {identifierType === 'email' ? (
              <Mail className="size-3.5" />
            ) : (
              <Phone className="size-3.5" />
            )}
            <span>
              {identifierType === 'email' ? t('emailDetected') : t('phoneDetected')}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Input
          type="password"
          autoComplete="current-password"
          label={t('passwordLabel')}
          placeholder={t('passwordPlaceholder')}
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      <Button
        type="submit"
        className="h-12 w-full rounded-xl text-base font-bold"
        disabled={isLoginPending || isRouting}
      >
        {isLoginPending || isRouting ? t('submitting') : t('submit')}
      </Button>
    </form>
  )
}