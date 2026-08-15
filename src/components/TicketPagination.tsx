'use client'

import { Pagination } from '@mantine/core'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function TicketPagination({ total, currentPage }: { total: number; currentPage: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleChange(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`${pathname}?${params.toString()}`)
  }

  return <Pagination total={total} value={currentPage} onChange={handleChange} />
}
