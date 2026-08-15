import {
  Alert,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  TableScrollContainer,
  TableTbody,
  Text,
  Title,
} from '@mantine/core'
import { requireUser } from '@/lib/dal'
import { apiFetch } from '@/lib/api'
import { TicketFilters } from '@/components/TicketFilters'
import { TicketPagination } from '@/components/TicketPagination'
import { TicketTableHeader } from '@/components/TicketTableHeader'
import { TicketRow } from '@/components/TicketRow'
import type { Category, Paginated, Ticket, TicketStats, TicketStatus, User } from '@/types'

type SearchParams = {
  status?: string
  priority?: string
  categoryId?: string
  requesterId?: string
  search?: string
  order?: string
  page?: string
}

const STATUSES: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: 'Abertos',
  IN_PROGRESS: 'Em andamento',
  RESOLVED: 'Resolvidos',
  CLOSED: 'Fechados',
}

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { user, token } = await requireUser()
  const params = await searchParams
  const isAdmin = user.role === 'ADMIN'

  const [ticketsResult, categoriesResult, requestersResult, statsResult, highPriorityOpen] =
    await Promise.all([
      apiFetch<Paginated<Ticket>>('/tickets', {
        token,
        searchParams: {
          status: params.status,
          priority: params.priority,
          categoryId: params.categoryId,
          requesterId: params.requesterId,
          search: params.search,
          page: params.page,
          order: params.order ?? '-createdAt',
        },
      }),
      apiFetch<Paginated<Category>>('/categories', { token, searchParams: { limit: 100 } }),
      isAdmin
        ? apiFetch<Paginated<User>>('/users', { token, searchParams: { limit: 100 } })
        : Promise.resolve(null),
      // Contagem por status + percentual vêm prontos da API — os cards de
      // resumo só exibem, não recalculam nada (e por isso já refletem os
      // filtros de busca/prioridade/categoria/solicitante ativos).
      apiFetch<{ data: TicketStats }>('/tickets/stats', {
        token,
        searchParams: {
          priority: params.priority,
          categoryId: params.categoryId,
          requesterId: params.requesterId,
          search: params.search,
        },
      }),
      apiFetch<Paginated<Ticket>>('/tickets', {
        token,
        searchParams: { status: 'OPEN', priority: 'HIGH', limit: 1 },
      }),
    ])

  const counts = Object.fromEntries(
    statsResult.data.statuses.map((entry) => [entry.status, entry])
  ) as Record<TicketStatus, TicketStats['statuses'][number]>

  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>Chamados</Title>
        <Text c="dimmed" size="sm">
          Acompanhe e gerencie todos os chamados
        </Text>
      </div>

      <SimpleGrid cols={{ base: 2, sm: 4 }}>
        {STATUSES.map((status) => (
          <Paper key={status} withBorder shadow="xs" p="md" radius="md">
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
              {STATUS_LABELS[status]}
            </Text>
            <Text size="xl" fw={700}>
              {counts[status]?.count ?? 0}{' '}
              <Text span size="sm" fw={500} c="dimmed">
                (
                {(counts[status]?.percentage ?? 0).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                %)
              </Text>
            </Text>
          </Paper>
        ))}
      </SimpleGrid>

      {highPriorityOpen.meta.total > 0 && (
        <Alert color="red" title="Atenção" variant="light">
          {highPriorityOpen.meta.total} chamado(s) de prioridade ALTA em aberto aguardando
          atendimento.
        </Alert>
      )}

      <TicketFilters categories={categoriesResult.data} requesters={requestersResult?.data ?? []} />

      <TableScrollContainer minWidth={1060}>
        <Table verticalSpacing="sm" highlightOnHover style={{ tableLayout: 'fixed' }}>
          <TicketTableHeader />
          <TableTbody>
            {ticketsResult.data.map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} />
            ))}
          </TableTbody>
        </Table>
      </TableScrollContainer>

      {ticketsResult.data.length === 0 && (
        <Text c="dimmed" ta="center">
          Nenhum chamado encontrado.
        </Text>
      )}

      {ticketsResult.meta.lastPage > 1 && (
        <TicketPagination
          total={ticketsResult.meta.lastPage}
          currentPage={ticketsResult.meta.currentPage}
        />
      )}
    </Stack>
  )
}
