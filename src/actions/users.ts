'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { apiFetch, ApiError } from '@/lib/api'
import { getToken } from '@/lib/dal'
import type { Role } from '@/types'

export type FormState = { error?: string } | undefined

export async function createUserAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const token = await getToken()
  if (!token) redirect('/login')

  const name = String(formData.get('name') ?? '')
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const role = String(formData.get('role') ?? '')

  try {
    await apiFetch('/users', { method: 'POST', token, body: { name, email, password, role } })
  } catch (error) {
    if (error instanceof ApiError) return { error: error.messages.join(', ') }
    return { error: 'Não foi possível criar o usuário.' }
  }

  revalidatePath('/users')
  redirect('/users')
}

export async function updateUserRoleAction(id: number, role: Role): Promise<void> {
  const token = await getToken()
  if (!token) redirect('/login')

  await apiFetch(`/users/${id}`, { method: 'PATCH', token, body: { role } })
  revalidatePath('/users')
}

export async function deleteUserAction(id: number): Promise<void> {
  const token = await getToken()
  if (!token) redirect('/login')

  await apiFetch(`/users/${id}`, { method: 'DELETE', token })
  revalidatePath('/users')
}
