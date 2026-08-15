import { notFound } from 'next/navigation'
import { Card, Grid, GridCol, Group, Stack, Text, Title } from '@mantine/core'
import { requireUser } from '@/lib/dal'
import { apiFetch, ApiError } from '@/lib/api'
import { StatusBadge } from '@/components/StatusBadge'
import { PriorityBadge } from '@/components/PriorityBadge'
import { TicketAdminActions } from '@/components/TicketAdminActions'
import { TicketHistoryTimeline } from '@/components/TicketHistoryTimeline'
import { AddCommentForm } from '@/components/AddCommentForm'
import { CancelTicketButton } from '@/components/CancelTicketButton'
import type { Category, Paginated, Ticket, User } from '@/types'

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { user, token } = await requireUser()

  let ticket: Ticket
  try {
    const result = await apiFetch<{ data: Ticket }>(`/tickets/${id}`, { token })
    ticket = result.data
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) {
      notFound()
    }
    throw error
  }

  const isAdmin = user.role === 'ADMIN'
  const canCancel = (isAdmin || ticket.requesterId === user.id) && ticket.status !== 'CLOSED'

  let categories: Category[] = []
  let admins: User[] = []
  if (isAdmin) {
    const [categoriesResult, usersResult] = await Promise.all([
      apiFetch<Paginated<Category>>('/categories', { token, searchParams: { limit: 100 } }),
      apiFetch<Paginated<User>>('/users', { token, searchParams: { limit: 100 } }),
    ])
    categories = categoriesResult.data
    admins = usersResult.data.filter((candidate) => candidate.role === 'ADMIN')
  }

  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>{ticket.title}</Title>
        <Text c="dimmed" size="sm">
          Aberto por {ticket.requester?.name ?? '—'} em{' '}
          {new Date(ticket.createdAt).toLocaleString('pt-BR')}
        </Text>
      </div>

      <Grid gap="lg" align="flex-start">
        <GridCol span={{ base: 12, md: 8 }}>
          <Stack gap="lg">
            <Card withBorder padding="lg" radius="md">
              <Stack gap="sm">
                <Text fw={600}>Descrição</Text>
                <Text style={{ whiteSpace: 'pre-wrap' }}>{ticket.description}</Text>
                <Text size="sm" c="dimmed">
                  Classificação:{' '}
                  {ticket.classificationOrigin === 'AI' ? 'Sugerida pela IA' : 'Manual'}
                </Text>
              </Stack>
            </Card>

            <Card withBorder padding="lg" radius="md">
              <Stack gap="sm">
                <Text fw={600}>Adicionar comentário</Text>
                <AddCommentForm ticketId={ticket.id} />
              </Stack>
            </Card>

            <TicketHistoryTimeline
              comments={ticket.comments ?? []}
              histories={ticket.statusHistories ?? []}
            />
          </Stack>
        </GridCol>

        <GridCol span={{ base: 12, md: 4 }} pos="sticky" top={84}>
          <Stack gap="md">
            {isAdmin ? (
              <Card withBorder padding="md" radius="md">
                <TicketAdminActions
                  ticket={ticket}
                  categories={categories}
                  admins={admins}
                  canCancel={canCancel}
                />
              </Card>
            ) : (
              <>
                <Card withBorder padding="md" radius="md">
                  <Stack gap="xs">
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                      Status e prioridade
                    </Text>
                    <Group gap="xs">
                      <StatusBadge status={ticket.status} />
                      <PriorityBadge priority={ticket.priority} />
                    </Group>
                  </Stack>
                </Card>

                <Card withBorder padding="md" radius="md">
                  <Stack gap={2}>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                      Categoria
                    </Text>
                    <Text fw={600}>{ticket.category?.name ?? '—'}</Text>
                  </Stack>
                </Card>

                <Card withBorder padding="md" radius="md">
                  <Stack gap={2}>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                      Responsável
                    </Text>
                    <Text fw={600}>{ticket.assignee?.name ?? 'Não atribuído'}</Text>
                  </Stack>
                </Card>

                {canCancel && (
                  <Card withBorder padding="md" radius="md">
                    <CancelTicketButton ticketId={ticket.id} fullWidth />
                  </Card>
                )}
              </>
            )}
          </Stack>
        </GridCol>
      </Grid>
    </Stack>
  )
}
