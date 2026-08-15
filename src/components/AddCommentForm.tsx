'use client'

import { useActionState } from 'react'
import { Alert, Button, Stack, Textarea } from '@mantine/core'
import { addCommentAction } from '@/actions/comments'

export function AddCommentForm({ ticketId }: { ticketId: number }) {
  const action = addCommentAction.bind(null, ticketId)
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <form action={formAction}>
      <Stack gap="xs">
        {state?.error && (
          <Alert color="red" variant="light">
            {state.error}
          </Alert>
        )}
        <Textarea name="content" placeholder="Adicionar um comentário..." required minRows={3} />
        <Button type="submit" loading={pending} style={{ alignSelf: 'flex-end' }}>
          Enviar
        </Button>
      </Stack>
    </form>
  )
}
