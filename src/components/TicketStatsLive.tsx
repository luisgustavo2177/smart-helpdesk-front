'use client'

import { useEffect, useRef, useState } from 'react'
import { Alert, Group, Paper, SegmentedControl, SimpleGrid, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useSearchParams } from 'next/navigation'
import type { TicketPriority, TicketStats, TicketStatus } from '@/types'

const POLL_INTERVAL_MS = 8000

const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: 'Abertos',
  IN_PROGRESS: 'Em andamento',
  RESOLVED: 'Resolvidos',
  CLOSED: 'Fechados',
}

const PRIORITY_LABELS: Record<TicketPriority, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
}

/** Filtros que também valem pro indicador ao vivo — igual ao resto da tela, exceto `status`. */
const LIVE_FILTER_KEYS = ['priority', 'categoryId', 'requesterId', 'search'] as const

function formatPercentage(value: number) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR')
}

export function TicketStatsLive({ initialStats }: { initialStats: TicketStats }) {
  const searchParams = useSearchParams()
  const [stats, setStats] = useState(initialStats)
  const [view, setView] = useState<'status' | 'priority'>('status')
  const seenHighPriorityIds = useRef(
    new Set(initialStats.highPriorityOpen.tickets.map((ticket) => ticket.id))
  )

  useEffect(() => {
    let cancelled = false

    async function poll() {
      const params = new URLSearchParams()
      for (const key of LIVE_FILTER_KEYS) {
        const value = searchParams.get(key)
        if (value) params.set(key, value)
      }

      try {
        const query = params.toString()
        const response = await fetch(`/api/tickets/stats${query ? `?${query}` : ''}`, {
          cache: 'no-store',
        })
        if (!response.ok || cancelled) return

        const payload: { data: TicketStats } = await response.json()
        const nextStats = payload.data

        for (const ticket of nextStats.highPriorityOpen.tickets) {
          if (!seenHighPriorityIds.current.has(ticket.id)) {
            notifications.show({
              color: 'red',
              title: 'Novo chamado de prioridade ALTA',
              message: ticket.title,
              autoClose: 8000,
            })
          }
        }
        seenHighPriorityIds.current = new Set(
          nextStats.highPriorityOpen.tickets.map((ticket) => ticket.id)
        )

        if (!cancelled) setStats(nextStats)
      } catch {
        // uma falha pontual de rede não deve derrubar o polling — a próxima tentativa segue normal
      }
    }

    const interval = setInterval(poll, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [searchParams])

  return (
    <>
      <Group justify="space-between" align="center" wrap="wrap">
        <Group gap={6}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'var(--mantine-color-brand-6)',
              display: 'inline-block',
              animation: 'shd-pulse 1.6s ease-in-out infinite',
            }}
          />
          <Text size="xs" c="dimmed">
            Ao vivo · atualizado às {formatTime(stats.generatedAt)}
          </Text>
        </Group>

        <SegmentedControl
          size="xs"
          value={view}
          onChange={(value) => setView(value as 'status' | 'priority')}
          data={[
            { label: 'Status', value: 'status' },
            { label: 'Prioridade', value: 'priority' },
          ]}
        />

        <style>{`
          @keyframes shd-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.25; }
          }
        `}</style>
      </Group>

      {view === 'status' ? (
        <SimpleGrid cols={{ base: 2, sm: 4 }}>
          {stats.statuses.map((entry) => (
            <Paper key={entry.status} withBorder shadow="xs" p="md" radius="md">
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                {STATUS_LABELS[entry.status]}
              </Text>
              <Text size="xl" fw={700}>
                {entry.count}{' '}
                <Text span size="sm" fw={500} c="dimmed">
                  ({formatPercentage(entry.percentage)}%)
                </Text>
              </Text>
            </Paper>
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid cols={{ base: 3 }}>
          {stats.priorities.map((entry) => (
            <Paper key={entry.priority} withBorder shadow="xs" p="md" radius="md">
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Prioridade {PRIORITY_LABELS[entry.priority]}
              </Text>
              <Text size="xl" fw={700}>
                {entry.count}{' '}
                <Text span size="sm" fw={500} c="dimmed">
                  ({formatPercentage(entry.percentage)}%)
                </Text>
              </Text>
            </Paper>
          ))}
        </SimpleGrid>
      )}

      {stats.highPriorityOpen.count > 0 && (
        <Alert color="red" title="Atenção" variant="light">
          {stats.highPriorityOpen.count} chamado(s) de prioridade ALTA em aberto aguardando
          atendimento.
        </Alert>
      )}
    </>
  )
}
