import { Group, Stack, Title } from '@mantine/core'
import { requireAdmin } from '@/lib/dal'
import { apiFetch } from '@/lib/api'
import { UserManager } from '@/components/UserManager'
import { LinkButton } from '@/components/LinkButton'
import type { Paginated, User } from '@/types'

export default async function UsersPage() {
  const { user, token } = await requireAdmin()
  const result = await apiFetch<Paginated<User>>('/users', {
    token,
    searchParams: { limit: 100 },
  })

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Usuários</Title>
        <LinkButton href="/users/new">Novo usuário</LinkButton>
      </Group>
      <UserManager users={result.data} currentUserId={user.id} />
    </Stack>
  )
}
