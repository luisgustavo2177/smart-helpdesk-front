import { Stack, Title } from '@mantine/core'
import { requireAdmin } from '@/lib/dal'
import { CreateUserForm } from '@/components/CreateUserForm'

export default async function NewUserPage() {
  await requireAdmin()

  return (
    <Stack gap="lg">
      <Title order={2}>Novo usuário</Title>
      <CreateUserForm />
    </Stack>
  )
}
