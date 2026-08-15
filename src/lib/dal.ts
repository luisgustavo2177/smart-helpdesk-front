import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { apiFetch, ApiError } from './api'
import { TOKEN_COOKIE } from './config'
import type { User } from '@/types'

/**
 * "Data Access Layer": ponto único pra ler o token/usuário autenticado.
 * A autorização de verdade continua na API (Bouncer) — isso aqui só evita
 * decidir o que renderizar/redirecionar com base num cookie que pode ter
 * expirado ou sido revogado sem a gente saber.
 */

export async function getToken(): Promise<string | null> {
  const store = await cookies()
  return store.get(TOKEN_COOKIE)?.value ?? null
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const token = await getToken()
  if (!token) return null

  try {
    const { data } = await apiFetch<{ data: User }>('/auth/me', { token })
    return data
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      return null
    }
    throw error
  }
})

export async function requireUser(): Promise<{ user: User; token: string }> {
  const [user, token] = await Promise.all([getCurrentUser(), getToken()])
  if (!user || !token) redirect('/login')
  return { user, token }
}

export async function requireAdmin(): Promise<{ user: User; token: string }> {
  const session = await requireUser()
  if (session.user.role !== 'ADMIN') redirect('/tickets')
  return session
}
