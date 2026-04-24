import { z } from 'zod'

type Translate = (key: string) => string

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^\+?[\d\s-]{9,}$/

function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value)
}

function isValidPhone(value: string): boolean {
  return PHONE_REGEX.test(value.replace(/\s/g, ''))
}

export function createLoginSchema(t: Translate) {
  return z.object({
    identifier: z
      .string()
      .trim()
      .min(1, t('required'))
      .refine(
        (value) => isValidEmail(value) || isValidPhone(value),
        { message: t('identifierInvalid') }
      ),
    password: z.string().min(1, t('required')),
  })
}

export function createRegisterSchema(t: Translate) {
  return z
    .object({
      firstName: z.string().trim().min(1, t('required')),
      lastName: z.string().trim().min(1, t('required')),
      email: z
        .string()
        .trim()
        .min(1, t('required'))
        .email(t('email')),
      phone: z
        .string()
        .trim()
        .refine(
          (value) => value.length === 0 || isValidPhone(value),
          { message: t('phone') }
        ),
      password: z.string().min(6, t('passwordMin')),
      confirmPassword: z.string().min(6, t('passwordMin')),
      isBuyer: z.boolean(),
      isSeller: z.boolean(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: t('passwordMatch'),
    })
    .refine((data) => data.isBuyer || data.isSeller, {
      path: ['isBuyer'],
      message: t('roleRequired'),
    })
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>
export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>