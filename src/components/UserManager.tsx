'use client'

import { useTransition } from 'react'
import {
  Badge,
  Button,
  Group,
  Select,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
} from '@mantine/core'
import { deleteUserAction, updateUserRoleAction } from '@/actions/users'
import type { Role, User } from '@/types'

const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'REQUESTER', label: 'Solicitante' },
]

export function UserManager({ users, currentUserId }: { users: User[]; currentUserId: number }) {
  return (
    <Table verticalSpacing="sm">
      <TableThead>
        <TableTr>
          <TableTh>Nome</TableTh>
          <TableTh>E-mail</TableTh>
          <TableTh>Papel</TableTh>
          <TableTh />
        </TableTr>
      </TableThead>
      <TableTbody>
        {users.map((user) => (
          <UserRow key={user.id} user={user} isSelf={user.id === currentUserId} />
        ))}
      </TableTbody>
    </Table>
  )
}

function UserRow({ user, isSelf }: { user: User; isSelf: boolean }) {
  const [pending, startTransition] = useTransition()

  return (
    <TableTr>
      <TableTd>
        <Group gap={4}>
          {user.name}
          {isSelf && (
            <Badge size="xs" variant="light">
              você
            </Badge>
          )}
        </Group>
      </TableTd>
      <TableTd>{user.email}</TableTd>
      <TableTd>
        <Select
          data={ROLE_OPTIONS}
          value={user.role}
          disabled={isSelf || pending}
          allowDeselect={false}
          w={160}
          onChange={(value) => {
            if (!value) return
            startTransition(() => {
              updateUserRoleAction(user.id, value as Role)
            })
          }}
        />
      </TableTd>
      <TableTd>
        <Button
          color="red"
          variant="subtle"
          size="xs"
          disabled={isSelf || pending}
          onClick={() => {
            if (window.confirm(`Remover o usuário "${user.name}"?`)) {
              startTransition(() => {
                deleteUserAction(user.id)
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
