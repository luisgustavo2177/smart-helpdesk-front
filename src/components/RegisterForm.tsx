'use client'

import { useActionState } from 'react'
import { Alert, Button, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core'
import Link from 'next/link'
import { registerAction } from '@/actions/auth'

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, undefined)

  return (
    <Paper withBorder shadow="sm" p="xl" radius="md" w={380}>
      <Stack gap="md">
        <div>
          <Title order={2} size="h3">
            Criar conta
          </Title>
          <Text c="dimmed" size="sm">
            Cadastro de solicitante — abra e acompanhe seus chamados
          </Text>
        </div>

        <form action={formAction}>
          <Stack gap="sm">
            {state?.error && (
              <Alert color="red" variant="light">
                {state.error}
              </Alert>
            )}

            <TextInput label="Nome" name="name" required autoComplete="name" />
            <TextInput label="E-mail" name="email" type="email" required autoComplete="email" />
            <PasswordInput
              label="Senha"
              name="password"
              required
              minLength={8}
              description="Mínimo de 8 caracteres"
              autoComplete="new-password"
            />

            <Button type="submit" loading={pending} fullWidth mt="sm">
              Cadastrar
            </Button>
          </Stack>
        </form>

        <Text size="sm" ta="center">
          Já tem conta?{' '}
          <Text component={Link} href="/login" fw={600} c="brand">
            Entrar
          </Text>
        </Text>
      </Stack>
    </Paper>
  )
}
