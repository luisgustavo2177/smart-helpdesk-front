import { Stack, Title } from '@mantine/core'
import { requireAdmin } from '@/lib/dal'
import { apiFetch } from '@/lib/api'
import { CategoryManager } from '@/components/CategoryManager'
import type { Category, Paginated } from '@/types'

export default async function CategoriesPage() {
  const { token } = await requireAdmin()
  const result = await apiFetch<Paginated<Category>>('/categories', {
    token,
    searchParams: { limit: 100 },
  })

  return (
    <Stack gap="lg">
      <Title order={2}>Categorias</Title>
      <CategoryManager categories={result.data} />
    </Stack>
  )
}
