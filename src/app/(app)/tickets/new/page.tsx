import { Stack, Title } from '@mantine/core'
import { NewTicketForm } from '@/components/NewTicketForm'

export default function NewTicketPage() {
  return (
    <Stack gap="lg">
      <Title order={2}>Novo chamado</Title>
      <NewTicketForm />
    </Stack>
  )
}
