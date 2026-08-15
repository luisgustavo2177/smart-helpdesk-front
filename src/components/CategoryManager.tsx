'use client'

import { useActionState, useTransition } from 'react'
import {
  Alert,
  Button,
  Group,
  Stack,
  Switch,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  TextInput,
} from '@mantine/core'
import {
  createCategoryAction,
  deleteCategoryAction,
  toggleCategoryStatusAction,
} from '@/actions/categories'
import type { Category } from '@/types'

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [state, formAction, pending] = useActionState(createCategoryAction, undefined)

  return (
    <Stack gap="lg">
      <form action={formAction}>
        <Group align="flex-end">
          <TextInput
            name="name"
            label="Nova categoria"
            placeholder="Ex.: Telefonia"
            required
            minLength={2}
          />
          <Button type="submit" loading={pending}>
            Adicionar
          </Button>
        </Group>
        {state?.error && (
          <Alert color="red" variant="light" mt="xs">
            {state.error}
          </Alert>
        )}
      </form>

      <Table verticalSpacing="sm">
        <TableThead>
          <TableTr>
            <TableTh>Nome</TableTh>
            <TableTh>Ativa</TableTh>
            <TableTh />
          </TableTr>
        </TableThead>
        <TableTbody>
          {categories.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </TableTbody>
      </Table>
    </Stack>
  )
}

function CategoryRow({ category }: { category: Category }) {
  const [pending, startTransition] = useTransition()

  return (
    <TableTr>
      <TableTd>{category.name}</TableTd>
      <TableTd>
        <Switch
          checked={category.status}
          disabled={pending}
          onChange={(event) => {
            const checked = event.currentTarget.checked
            startTransition(() => {
              toggleCategoryStatusAction(category.id, checked)
            })
          }}
        />
      </TableTd>
      <TableTd>
        <Button
          color="red"
          variant="subtle"
          size="xs"
          disabled={pending}
          onClick={() => {
            if (window.confirm(`Remover a categoria "${category.name}"?`)) {
              startTransition(() => {
                deleteCategoryAction(category.id)
              })
            }
          }}
        >
          Remover
        </Button>
      </TableTd>
    </TableTr>
  )
}
