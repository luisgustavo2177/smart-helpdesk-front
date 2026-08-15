'use client'

import { useActionState } from 'react'
import { Alert, Button, PasswordInput, Select, Stack, TextInput } from '@mantine/core'
import { createUserAction } from '@/actions/users'

const ROLE_OPTIONS = [
  { value: 'REQUESTER', label: 'Solicitante' },
  { value: 'ADMIN', label: 'Admin' },
]

export function CreateUserForm() {
  const [state, formAction, pending] = useActionState(createUserAction, undefined)

  return (
    <form action={formAction}>
      <Stack gap="sm" maw={480}>
        {state?.error && (
          <Alert color="red" variant="light">
            {state.error}
          </Alert>
        )}

        <TextInput label="Nome" name="name" required minLength={2} autoComplete="name" />
        <TextInput
          label="E-mail"
          name="email"
          type="email"
          required
          placeholder="usuario@helpdesk.com"
          description="Precisa ser do domínio @helpdesk.com"
          autoComplete="email"
        />
        <PasswordInput
          label="Senha"
          name="password"
          required
          minLength={8}
          description="Mínimo de 8 caracteres"
          autoComplete="new-password"
        />
        <Select
          label="Papel"
          name="role"
          data={ROLE_OPTIONS}
          defaultValue="REQUESTER"
          allowDeselect={false}
        />

        <Button type="submit" loading={pending} mt="xs">
          Criar usuário
        </Button>
      </Stack>
    </form>
  )
}
