'use client'

import { useEffect, useState } from 'react'
import { Group, Select, TextInput } from '@mantine/core'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ExportTicketsButton } from './ExportTicketsButton'
import type { Category, UserSummary } from '@/types'

const STATUS_OPTIONS = [
  { value: 'OPEN', label: 'Aberto' },
  { value: 'IN_PROGRESS', label: 'Em andamento' },
  { value: 'RESOLVED', label: 'Resolvido' },
  { value: 'CLOSED', label: 'Fechado' },
]

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Baixa' },
  { value: 'MEDIUM', label: 'Média' },
  { value: 'HIGH', label: 'Alta' },
]

export function TicketFilters({
  categories,
  requesters,
}: {
  categories: Category[]
  requesters: UserSummary[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') ?? '')

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  // Busca por texto é debounced para não disparar uma navegação a cada tecla digitada.
  useEffect(() => {
    const currentSearch = searchParams.get('search') ?? ''
    if (search === currentSearch) return
    const timeout = setTimeout(() => updateParam('search', search || null), 400)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  return (
    <Group justify="space-between" align="flex-end" wrap="wrap" gap="sm">
      <Group align="flex-end" wrap="wrap" gap="sm">
        <TextInput
          placeholder="Digite sua busca..."
          w={240}
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
        />
        <Select
          label="Status"
          placeholder="Todos"
          clearable
          w={160}
          data={STATUS_OPTIONS}
          value={searchParams.get('status')}
          onChange={(value) => updateParam('status', value)}
        />
        <Select
          label="Prioridade"
          placeholder="Todas"
          clearable
          w={150}
          data={PRIORITY_OPTIONS}
          value={searchParams.get('priority')}
          onChange={(value) => updateParam('priority', value)}
        />
        <Select
          label="Categoria"
          placeholder="Todas"
          clearable
          w={180}
          data={categories.map((category) => ({
            value: String(category.id),
            label: category.name,
          }))}
          value={searchParams.get('categoryId')}
          onChange={(value) => updateParam('categoryId', value)}
        />
        {requesters.length > 0 && (
          <Select
            label="Solicitante"
            placeholder="Todos"
            clearable
            searchable
            w={200}
            data={requesters.map((requester) => ({
              value: String(requester.id),
              label: requester.name,
            }))}
            value={searchParams.get('requesterId')}
            onChange={(value) => updateParam('requesterId', value)}
          />
        )}
      </Group>
      <ExportTicketsButton />
    </Group>
  )
}
