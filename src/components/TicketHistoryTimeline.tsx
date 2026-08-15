import { Card, Group, Paper, Stack, Text, Timeline, TimelineItem } from '@mantine/core'
import { IconArrowsExchange, IconMessageCircle2 } from '@tabler/icons-react'
import type { Comment, TicketStatus, TicketStatusHistory } from '@/types'

const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: 'Aberto',
  IN_PROGRESS: 'Em andamento',
  RESOLVED: 'Resolvido',
  CLOSED: 'Fechado',
}

const STATUS_COLORS: Record<TicketStatus, string> = {
  OPEN: 'brand',
  IN_PROGRESS: 'orange',
  RESOLVED: 'teal',
  CLOSED: 'gray',
}

type Event =
  | { kind: 'comment'; at: string; data: Comment }
  | { kind: 'status'; at: string; data: TicketStatusHistory }

export function TicketHistoryTimeline({
  comments,
  histories,
}: {
  comments: Comment[]
  histories: TicketStatusHistory[]
}) {
  const events: Event[] = [
    ...comments.map((comment): Event => ({ kind: 'comment', at: comment.createdAt, data: comment })),
    ...histories.map((history): Event => ({ kind: 'status', at: history.createdAt, data: history })),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())

  return (
    <Card withBorder padding="lg" radius="md">
      <Stack gap="md">
        <Text fw={600}>Histórico</Text>

        {events.length === 0 && (
          <Text c="dimmed" size="sm">
            Nenhuma interação registrada ainda.
          </Text>
        )}

        <Timeline active={events.length} bulletSize={28} lineWidth={2}>
          {events.map((event) =>
            event.kind === 'comment' ? (
              <TimelineItem
                key={`comment-${event.data.id}`}
                color="gray"
                bullet={<IconMessageCircle2 size={16} />}
                title={
                  <Group gap={6} wrap="wrap">
                    <Text size="sm" fw={600}>
                      {event.data.author?.name ?? 'Usuário'}
                    </Text>
                    <Text size="xs" c="dimmed">
                      comentou · {new Date(event.at).toLocaleString('pt-BR')}
                    </Text>
                  </Group>
                }
              >
                <Paper bg="gray.0" withBorder p="sm" radius="md" mt={4}>
                  <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                    {event.data.content}
                  </Text>
                </Paper>
              </TimelineItem>
            ) : (
              <TimelineItem
                key={`status-${event.data.id}`}
                color={STATUS_COLORS[event.data.newStatus]}
                bullet={<IconArrowsExchange size={16} />}
                title={
                  <Group gap={6} wrap="wrap">
                    <Text size="sm" fw={600}>
                      {event.data.changedBy?.name ?? 'Sistema'}
                    </Text>
                    <Text size="xs" c="dimmed">
                      alterou o status · {new Date(event.at).toLocaleString('pt-BR')}
                    </Text>
                  </Group>
                }
              >
                <Text size="sm" c="dimmed" mt={4}>
                  {event.data.previousStatus ? STATUS_LABELS[event.data.previousStatus] : 'Criação'}
                  {' → '}
                  <Text span fw={700} c={STATUS_COLORS[event.data.newStatus]} inherit>
                    {STATUS_LABELS[event.data.newStatus]}
                  </Text>
                </Text>
              </TimelineItem>
            )
          )}
        </Timeline>
      </Stack>
    </Card>
  )
}
