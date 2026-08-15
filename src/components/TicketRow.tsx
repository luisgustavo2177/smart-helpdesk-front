'use client'

import { useRouter } from 'next/navigation'
import { TableTd, TableTr } from '@mantine/core'
import { StatusBadge } from './StatusBadge'
import { PriorityBadge } from './PriorityBadge'
import type { Ticket } from '@/types'

const cellStyle: React.CSSProperties = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

export function TicketRow({ ticket }: { ticket: Ticket }) {
  const router = useRouter()

  return (
    <TableTr
      onClick={() => router.push(`/tickets/${ticket.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <TableTd style={cellStyle}>{ticket.title}</TableTd>
      <TableTd style={cellStyle}>{ticket.category?.name ?? '—'}</TableTd>
      <TableTd style={cellStyle}>
        <PriorityBadge priority={ticket.priority} />
      </TableTd>
      <TableTd style={cellStyle}>
        <StatusBadge status={ticket.status} />
      </TableTd>
      <TableTd style={cellStyle}>{ticket.requester?.name ?? '—'}</TableTd>
      <TableTd style={cellStyle}>{ticket.assignee?.name ?? '—'}</TableTd>
      <TableTd style={cellStyle}>{new Date(ticket.createdAt).toLocaleString('pt-BR')}</TableTd>
    </TableTr>
  )
}
