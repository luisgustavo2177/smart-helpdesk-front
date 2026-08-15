'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { apiFetch, ApiError } from '@/lib/api'
import { getToken } from '@/lib/dal'

export type FormState = { error?: string } | undefined

export async function createCategoryAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const token = await getToken()
  if (!token) redirect('/login')

  const name = String(formData.get('name') ?? '')

  try {
    await apiFetch('/categories', { method: 'POST', token, body: { name } })
  } catch (error) {
    if (error instanceof ApiError) return { error: error.messages.join(', ') }
    return { error: 'Não foi possível criar a categoria.' }
  }

  revalidatePath('/categories')
  return {}
}

export async function toggleCategoryStatusAction(id: number, status: boolean): Promise<void> {
  const token = await getToken()
  if (!token) redirect('/login')

  await apiFetch(`/categories/${id}`, { method: 'PATCH', token, body: { status } })
  revalidatePath('/categories')
}

export async function deleteCategoryAction(id: number): Promise<void> {
  const token = await getToken()
  if (!token) redirect('/login')

  await apiFetch(`/categories/${id}`, { method: 'DELETE', token })
  revalidatePath('/categories')
}
