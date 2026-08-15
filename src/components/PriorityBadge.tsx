import { Badge } from '@mantine/core'
import type { TicketPriority } from '@/types'

const LABELS: Record<TicketPriority, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
}

const COLORS: Record<TicketPriority, string> = {
  LOW: 'blue',
  MEDIUM: 'orange',
  HIGH: 'red',
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <Badge color={COLORS[priority]} variant="light">
      {LABELS[priority]}
    </Badge>
  )
}
