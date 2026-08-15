'use client'

import { useActionState } from 'react'
import { Alert, Button, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core'
import Link from 'next/link'
import { loginAction } from '@/actions/auth'

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined)

  return (
    <Paper withBorder shadow="sm" p="xl" radius="md" w={380}>
      <Stack gap="md">
        <div>
          <Title order={2} size="h3">
            Entrar
          </Title>
          <Text c="dimmed" size="sm">
            Central de chamados internos
          </Text>
        </div>

        <form action={formAction}>
          <Stack gap="sm">
            {state?.error && (
              <Alert color="red" variant="light">
                {state.error}
              </Alert>
            )}

            <TextInput label="E-mail" name="email" type="email" required autoComplete="email" />
            <PasswordInput
              label="Senha"
              name="password"
              required
              autoComplete="current-password"
            />

            <Button type="submit" loading={pending} fullWidth mt="sm">
              Entrar
            </Button>
          </Stack>
        </form>

        <Text size="sm" ta="center">
          Não tem conta?{' '}
          <Text component={Link} href="/register" fw={600} c="brand">
            Cadastre-se
          </Text>
        </Text>
      </Stack>
    </Paper>
  )
}
