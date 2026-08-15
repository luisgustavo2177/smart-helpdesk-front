'use client'

import { Button, Center, Stack, Text, Title } from '@mantine/core'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Center mih="100vh" p="md">
      <Stack align="center" gap="sm">
        <Title order={2}>Algo deu errado</Title>
        <Text c="dimmed">{error.message || 'Erro inesperado. Tente novamente.'}</Text>
        <Button onClick={reset}>Tentar novamente</Button>
      </Stack>
    </Center>
  )
}
