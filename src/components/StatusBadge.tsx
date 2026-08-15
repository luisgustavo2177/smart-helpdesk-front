import { Badge } from '@mantine/core'
import type { TicketStatus } from '@/types'

const LABELS: Record<TicketStatus, string> = {
  OPEN: 'Aberto',
  IN_PROGRESS: 'Em andamento',
  RESOLVED: 'Resolvido',
  CLOSED: 'Fechado',
}

const COLORS: Record<TicketStatus, string> = {
  OPEN: 'brand',
  IN_PROGRESS: 'orange',
  RESOLVED: 'teal',
  CLOSED: 'gray',
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <Badge color={COLORS[status]} variant="light">
      {LABELS[status]}
    </Badge>
  )
}
