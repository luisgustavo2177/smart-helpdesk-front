'use client'

import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  AppShellSection,
  Avatar,
  Burger,
  Divider,
  Group,
  NavLink,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconCategory2, IconPlus, IconTicket, IconUsers } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoutButton } from './LogoutButton'
import { LinkButton } from './LinkButton'
import type { User } from '@/types'

type Props = {
  user: User
  children: React.ReactNode
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function AppShellClient({ user, children }: Props) {
  const [opened, { toggle }] = useDisclosure()
  const pathname = usePathname()

  const links = [
    { href: '/tickets', label: 'Chamados', icon: IconTicket },
    ...(user.role === 'ADMIN'
      ? [
          { href: '/categories', label: 'Categorias', icon: IconCategory2 },
          { href: '/users', label: 'Usuários', icon: IconUsers },
        ]
      : []),
  ]

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !opened, desktop: !opened } }}
      padding="md"
      styles={{ main: { backgroundColor: '#f8f9fa' } }}
    >
      <AppShellHeader>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} size="sm" />
            <Title order={3} size="h4">
              Smart Helpdesk
            </Title>
          </Group>
          <LinkButton href="/tickets/new" leftSection={<IconPlus size={16} stroke={1.5} />}>
            Novo Chamado
          </LinkButton>
        </Group>
      </AppShellHeader>

      <AppShellNavbar p="md">
        <AppShellSection grow>
          <Stack gap="xs">
            {links.map((link) => (
              <NavLink
                key={link.href}
                component={Link}
                href={link.href}
                label={link.label}
                leftSection={
                  <link.icon size={18} stroke={1.5} color="var(--mantine-color-brand-6)" />
                }
                active={pathname.startsWith(link.href)}
              />
            ))}
          </Stack>
        </AppShellSection>

        <AppShellSection>
          <Divider mb="sm" />
          <Group gap="sm" mb="xs" wrap="nowrap">
            <Avatar radius="xl" color="brand">
              {getInitials(user.name)}
            </Avatar>
            <div style={{ overflow: 'hidden' }}>
              <Text size="sm" fw={500} truncate>
                {user.name}
              </Text>
              <Text size="xs" c="dimmed" truncate>
                {user.email}
              </Text>
            </div>
          </Group>
          <LogoutButton />
        </AppShellSection>
      </AppShellNavbar>

      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  )
}
