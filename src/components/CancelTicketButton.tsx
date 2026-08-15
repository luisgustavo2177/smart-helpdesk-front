'use client'

import { useState } from 'react'
import { Button } from '@mantine/core'
import { cancelTicketAction } from '@/actions/tickets'

export function CancelTicketButton({
  ticketId,
  fullWidth,
}: {
  ticketId: number
  fullWidth?: boolean
}) {
  const [pending, setPending] = useState(false)

  async function handleClick() {
    if (!window.confirm('Tem certeza que deseja cancelar este chamado?')) return
    setPending(true)
    await cancelTicketAction(ticketId)
  }

  return (
    <Button
      color="red"
      variant="light"
      size="sm"
      fullWidth={fullWidth}
      onClick={handleClick}
      loading={pending}
    >
      Cancelar chamado
    </Button>
  )
}
