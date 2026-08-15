'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { apiFetch, ApiError } from '@/lib/api'
import { TOKEN_COOKIE } from '@/lib/config'
import type { User } from '@/types'

export type FormState = { error?: string } | undefined

async function setTokenCookie(token: string) {
  const store = await cookies()
  store.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // alinhar com JWT_EXPIRES_IN da API (1d por padrão)
  })
}

export async function loginAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  try {
    const { token } = await apiFetch<{ data: User; token: string }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    await setTokenCookie(token)
  } catch (error) {
    if (error instanceof ApiError) return { error: error.messages.join(', ') }
    return { error: 'Não foi possível entrar. Tente novamente.' }
  }

  redirect('/tickets')
}

export async function registerAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = String(formData.get('name') ?? '')
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  try {
    const { token } = await apiFetch<{ data: User; token: string }>('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    })
    await setTokenCookie(token)
  } catch (error) {
    if (error instanceof ApiError) return { error: error.messages.join(', ') }
    return { error: 'Não foi possível cadastrar. Tente novamente.' }
  }

  redirect('/tickets')
}

export async function logoutAction(): Promise<void> {
  const store = await cookies()
  store.delete(TOKEN_COOKIE)
  redirect('/login')
}
