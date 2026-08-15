'use client'

import { Button } from '@mantine/core'
import { IconLogout } from '@tabler/icons-react'
import { logoutAction } from '@/actions/auth'

export function LogoutButton() {
  return (
    <form action={logoutAction} style={{ width: '100%' }}>
      <Button
        type="submit"
        variant="light"
        color="red"
        size="sm"
        fullWidth
        leftSection={<IconLogout size={16} stroke={1.5} />}
      >
        Sair
      </Button>
    </form>
  )
}
