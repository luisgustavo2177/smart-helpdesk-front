import { API_BASE_URL } from './config'

/** Formato de erro devolvido pela API ({ messages, status, ... }). */
export class ApiError extends Error {
  status: number
  messages: string[]

  constructor(status: number, messages: string[]) {
    super(messages[0] ?? `Erro ${status}`)
    this.status = status
    this.messages = messages
  }
}

type ApiFetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  token?: string | null
  searchParams?: Record<string, string | number | undefined | null>
}

/**
 * Cliente HTTP fino para a smart-helpdesk-api. Sempre chamado a partir do
 * servidor (Server Components/Actions) — o token nunca chega ao navegador.
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { method = 'GET', body, token, searchParams } = options

  const url = new URL(`${API_BASE_URL}${path}`)
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }

  const response = await fetch(url, {
    method,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const contentType = response.headers.get('content-type')
  const payload = contentType?.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    const messages: string[] = payload?.messages ?? [`Erro inesperado (${response.status})`]
    throw new ApiError(response.status, messages)
  }

  return payload as T
}
