import { NextRequest } from 'next/server'
import { getToken } from '@/lib/dal'
import { API_BASE_URL } from '@/lib/config'

/**
 * Proxy para o relatório .xlsx da API. Existe porque o botão de exportar
 * roda no navegador e o token JWT fica só num cookie httpOnly do servidor —
 * o navegador não tem como chamar a API AdonisJS diretamente com o header
 * `Authorization`.
 */
export async function GET(request: NextRequest) {
  const token = await getToken()
  if (!token) {
    return new Response('Não autenticado', { status: 401 })
  }

  const url = new URL(`${API_BASE_URL}/tickets/report`)
  request.nextUrl.searchParams.forEach((value, key) => {
    if (value) url.searchParams.set(key, value)
  })

  const apiResponse = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!apiResponse.ok) {
    const payload = await apiResponse.text()
    return new Response(payload || 'Erro ao gerar relatório', { status: apiResponse.status })
  }

  const buffer = await apiResponse.arrayBuffer()
  return new Response(buffer, {
    headers: {
      'Content-Type':
        apiResponse.headers.get('content-type') ??
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition':
        apiResponse.headers.get('content-disposition') ?? 'attachment; filename="relatorio.xlsx"',
    },
  })
}
