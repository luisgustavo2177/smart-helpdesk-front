'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { apiFetch, ApiError } from '@/lib/api'
import { getToken } from '@/lib/dal'

export type FormState = { error?: string } | undefined

export async function addCommentAction(
  ticketId: number,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const token = await getToken()
  if (!token) redirect('/login')

  const content = String(formData.get('content') ?? '')

  try {
    await apiFetch(`/tickets/${ticketId}/comments`, {
      method: 'POST',
      token,
      body: { content },
    })
  } catch (error) {
    if (error instanceof ApiError) return { error: error.messages.join(', ') }
    return { error: 'Não foi possível adicionar o comentário.' }
  }

  revalidatePath(`/tickets/${ticketId}`)
  return {}
}
