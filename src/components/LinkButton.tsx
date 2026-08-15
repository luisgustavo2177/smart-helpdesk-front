'use client'

import Link from 'next/link'
import { Button, type ButtonProps } from '@mantine/core'

/**
 * `<Button component={Link}>` não pode ser montado a partir de um Server
 * Component — passar o componente `Link` como prop cruza a fronteira
 * servidor/cliente com uma função, que não é serializável. Encapsulando a
 * composição aqui (num Client Component) resolve, e permite usar o botão a
 * partir de qualquer Server Component sem repetir isso em todo lugar.
 */
type Props = ButtonProps & {
  href: string
  children: React.ReactNode
}

export function LinkButton({ href, children, ...props }: Props) {
  return (
    <Button component={Link} href={href} {...props}>
      {children}
    </Button>
  )
}
