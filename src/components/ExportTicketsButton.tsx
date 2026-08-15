'use client'

import { Button } from '@mantine/core'
import { useSearchParams } from 'next/navigation'

const FILTER_KEYS = ['status', 'priority', 'categoryId', 'requesterId', 'search'] as const

/**
 * O .xlsx (aba de chamados + aba de resumo por status) é gerado inteiramente
 * na API — este botão só repassa os filtros ativos na tela para o endpoint.
 */
export function ExportTicketsButton() {
  const searchParams = useSearchParams()

  const params = new URLSearchParams()
  for (const key of FILTER_KEYS) {
    const value = searchParams.get(key)
    if (value) params.set(key, value)
  }

  const query = params.toString()
  const href = `/api/tickets/report${query ? `?${query}` : ''}`

  return (
    <Button component="a" href={href} variant="outline" target="_blank" rel="noopener">
      Exportar Relatório
    </Button>
  )
}
