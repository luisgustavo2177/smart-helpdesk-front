'use client'

import { useActionState } from 'react'
import { Alert, Button, Stack, Textarea, TextInput } from '@mantine/core'
import { createTicketAction } from '@/actions/tickets'

export function NewTicketForm() {
  const [state, formAction, pending] = useActionState(createTicketAction, undefined)

  return (
    <form action={formAction}>
      <Stack gap="sm" maw={640}>
        {state?.error && (
          <Alert color="red" variant="light">
            {state.error}
          </Alert>
        )}

        <TextInput
          label="Título"
          name="title"
          required
          minLength={3}
          placeholder="Resuma o problema em poucas palavras"
        />
        <Textarea
          label="Descrição"
          name="description"
          required
          minRows={5}
          minLength={10}
          placeholder="Descreva o problema com o máximo de detalhes possível"
          description="A categoria e a prioridade serão sugeridas automaticamente a partir da descrição."
        />

        <Button type="submit" loading={pending}>
          Abrir chamado
        </Button>
      </Stack>
    </form>
  )
}
