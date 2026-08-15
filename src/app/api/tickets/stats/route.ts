import { NextRequest, NextResponse } from 'next/server'
import { getToken } from '@/lib/dal'
import { API_BASE_URL } from '@/lib/config'

/**
 * Proxy para o indicador em tempo real (`TicketStatsLive`, que faz *poll*
 * nesse endpoint). Existe pelo mesmo motivo do proxy do relatório: o token
 * JWT fica num cookie httpOnly do servidor, e o `fetch` do navegador não
 * consegue anexar o header `Authorization` que a API AdonisJS exige.
 */
export async function GET(request: NextRequest) {
  const token = await getToken()
  if (!token) {
    return NextResponse.json({ messages: ['Não autenticado'] }, { status: 401 })
  }

  const url = new URL(`${API_BASE_URL}/tickets/stats`)
  request.nextUrl.searchParams.forEach((value, key) => {
    if (value) url.searchParams.set(key, value)
  })

  const apiResponse = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  const payload = await apiResponse.json()
  return NextResponse.json(payload, { status: apiResponse.status })
}
