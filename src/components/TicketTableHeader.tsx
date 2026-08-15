'use client'

import { Group, TableTh, TableThead, TableTr, Text, UnstyledButton } from '@mantine/core'
import { IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const COLUMNS = [
  { key: 'title', label: 'Título', width: 240 },
  { key: 'category', label: 'Categoria', width: 130 },
  { key: 'priority', label: 'Prioridade', width: 110 },
  { key: 'status', label: 'Status', width: 130 },
  { key: 'requester', label: 'Solicitante', width: 150 },
  { key: 'assignee', label: 'Responsável', width: 150 },
  { key: 'createdAt', label: 'Criado em', width: 150 },
]

export function TicketTableHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const order = searchParams.get('order') ?? '-createdAt'
  const activeField = order.startsWith('-') ? order.slice(1) : order
  const isDesc = order.startsWith('-')

  function handleSort(field: string) {
    const params = new URLSearchParams(searchParams.toString())
    const nextOrder = activeField === field && !isDesc ? `-${field}` : field
    params.set('order', nextOrder)
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <TableThead>
      <TableTr>
        {COLUMNS.map((column) => {
          const active = activeField === column.key
          const Icon = !active ? IconSelector : isDesc ? IconChevronDown : IconChevronUp

          return (
            <TableTh key={column.key} style={{ width: column.width }}>
              <UnstyledButton onClick={() => handleSort(column.key)}>
                <Group gap={4} wrap="nowrap">
                  <Text size="sm" fw={600} c={active ? 'brand' : undefined}>
                    {column.label}
                  </Text>
                  <Icon size={14} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </TableTh>
          )
        })}
      </TableTr>
    </TableThead>
  )
}
