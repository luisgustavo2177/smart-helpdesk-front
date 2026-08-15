'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { apiFetch, ApiError } from '@/lib/api'
import { getToken } from '@/lib/dal'
import type { Ticket } from '@/types'

export type FormState = { error?: string } | undefined

export async function createTicketAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const token = await getToken()
  if (!token) redirect('/login')

  const title = String(formData.get('title') ?? '')
  const description = String(formData.get('description') ?? '')

  let ticket: Ticket
  try {
    const result = await apiFetch<{ data: Ticket }>('/tickets', {
      method: 'POST',
      token,
      body: { title, description },
    })
    ticket = result.data
  } catch (error) {
    if (error instanceof ApiError) return { error: error.messages.join(', ') }
    return { error: 'Não foi possível abrir o chamado.' }
  }

  revalidatePath('/tickets')
  redirect(`/tickets/${ticket.id}`)
}

export async function updateTicketAction(
  id: number,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const token = await getToken()
  if (!token) redirect('/login')

  const body: Record<string, unknown> = {}
  const status = formData.get('status')
  const assigneeId = formData.get('assigneeId')
  const categoryId = formData.get('categoryId')
  const priority = formData.get('priority')

  if (status) body.status = String(status)
  if (assigneeId !== null && String(assigneeId) !== '') body.assigneeId = Number(assigneeId)
  if (categoryId) body.categoryId = Number(categoryId)
  if (priority) body.priority = String(priority)

  try {
    await apiFetch(`/tickets/${id}`, { method: 'PATCH', token, body })
  } catch (error) {
    if (error instanceof ApiError) return { error: error.messages.join(', ') }
    return { error: 'Não foi possível atualizar o chamado.' }
  }

  revalidatePath(`/tickets/${id}`)
  revalidatePath('/tickets')
  return {}
}

export async function cancelTicketAction(id: number): Promise<void> {
  const token = await getToken()
  if (!token) redirect('/login')

  await apiFetch(`/tickets/${id}`, { method: 'DELETE', token })

  revalidatePath('/tickets')
  redirect('/tickets')
}
