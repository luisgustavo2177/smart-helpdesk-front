'use client'

import { useActionState } from 'react'
import { Alert, Button, Divider, Select, Stack } from '@mantine/core'
import { updateTicketAction } from '@/actions/tickets'
import { CancelTicketButton } from './CancelTicketButton'
import type { Category, Ticket, User } from '@/types'

const STATUS_OPTIONS = [
  { value: 'OPEN', label: 'Aberto' },
  { value: 'IN_PROGRESS', label: 'Em andamento' },
  { value: 'RESOLVED', label: 'Resolvido' },
  { value: 'CLOSED', label: 'Fechado' },
]

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Baixa' },
  { value: 'MEDIUM', label: 'Média' },
  { value: 'HIGH', label: 'Alta' },
]

type Props = {
  ticket: Ticket
  categories: Category[]
  admins: User[]
  canCancel: boolean
}

export function TicketAdminActions({ ticket, categories, admins, canCancel }: Props) {
  const action = updateTicketAction.bind(null, ticket.id)
  const [state, formAction, pending] = useActionState(action, undefined)
  const isClosed = ticket.status === 'CLOSED'

  return (
    <form action={formAction}>
      <Stack gap="sm">
        {state?.error && (
          <Alert color="red" variant="light">
            {state.error}
          </Alert>
        )}

        <Select
          name="status"
          label="Status"
          data={STATUS_OPTIONS}
          defaultValue={ticket.status}
          disabled={isClosed}
          description={isClosed ? 'Chamado fechado não pode ser reaberto' : undefined}
          allowDeselect={false}
        />
        <Select
          name="priority"
          label="Prioridade"
          data={PRIORITY_OPTIONS}
          defaultValue={ticket.priority}
          allowDeselect={false}
        />
        <Select
          name="categoryId"
          label="Categoria"
          data={categories.map((category) => ({
            value: String(category.id),
            label: category.name,
          }))}
          defaultValue={String(ticket.categoryId)}
          allowDeselect={false}
        />
        <Select
          name="assigneeId"
          label="Responsável"
          placeholder="Não atribuído"
          clearable
          data={admins.map((admin) => ({ value: String(admin.id), label: admin.name }))}
          defaultValue={ticket.assigneeId ? String(ticket.assigneeId) : null}
        />

        <Button type="submit" loading={pending} fullWidth mt="xs">
          Salvar alterações
        </Button>

        {canCancel && (
          <>
            <Divider my={4} />
            <CancelTicketButton ticketId={ticket.id} fullWidth />
          </>
        )}
      </Stack>
    </form>
  )
}
