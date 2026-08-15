import { Stack, Table, TableScrollContainer, TableTbody, Text, Title } from '@mantine/core'
import { requireUser } from '@/lib/dal'
import { apiFetch } from '@/lib/api'
import { TicketFilters } from '@/components/TicketFilters'
import { TicketPagination } from '@/components/TicketPagination'
import { TicketTableHeader } from '@/components/TicketTableHeader'
import { TicketRow } from '@/components/TicketRow'
import { TicketStatsLive } from '@/components/TicketStatsLive'
import type { Category, Paginated, Ticket, TicketStats, User } from '@/types'

type SearchParams = {
  status?: string
  priority?: string
  categoryId?: string
  requesterId?: string
  search?: string
  order?: string
  page?: string
}

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { user, token } = await requireUser()
  const params = await searchParams
  const isAdmin = user.role === 'ADMIN'

  const [ticketsResult, categoriesResult, requestersResult, statsResult] = await Promise.all([
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
    // Contagem por status/prioridade + percentual + chamados ALTA/ABERTO vêm
    // prontos da API — os cards só exibem, não recalculam nada. O mesmo
    // endpoint alimenta o indicador ao vivo (`TicketStatsLive`, via polling).
    apiFetch<{ data: TicketStats }>('/tickets/stats', {
      token,
      searchParams: {
        priority: params.priority,
        categoryId: params.categoryId,
        requesterId: params.requesterId,
        search: params.search,
      },
    }),
  ])

  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>Chamados</Title>
        <Text c="dimmed" size="sm">
          Acompanhe e gerencie todos os chamados
        </Text>
      </div>

      <TicketStatsLive initialStats={statsResult.data} />

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
