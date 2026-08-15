import { Center, Stack, Text, Title } from '@mantine/core'
import { LinkButton } from '@/components/LinkButton'

export default function NotFound() {
  return (
    <Center mih="100vh" p="md">
      <Stack align="center" gap="sm">
        <Title order={2}>Página não encontrada</Title>
        <Text c="dimmed">O recurso que você procura não existe ou foi removido.</Text>
        <LinkButton href="/tickets">Voltar para os chamados</LinkButton>
      </Stack>
    </Center>
  )
}
