# smart-helpdesk-front

Interface web para central de chamados internos, com abertura e acompanhamento de tickets, triagem inteligente por IA, indicadores em tempo real e notificações de solicitações urgentes.

Consome a API [`smart-helpdesk-api`](../smart-helpdesk-api) — precisa dela rodando para funcionar.

## Tecnologias

- Node.js **>= 20.9** (testado com o LTS mais recente disponível)
- [Next.js **16.3**](https://nextjs.org/docs) (App Router, React Server Components, Server Actions)
- React **19**
- [Mantine **v9**](https://mantine.dev/) (UI) + `@tabler/icons-react`
- TypeScript

## Rodando localmente

**Pré-requisito:** a API (`smart-helpdesk-api`) já rodando — veja o README dela para subir o Postgres, migrations e seeds.

1. Instale as dependências: `npm install`
2. Copie `.env.example` para `.env.local` e ajuste `API_BASE_URL` se a API não estiver em `http://localhost:3333/api/v1`
3. Suba o front: `npm run dev` (fica em `http://localhost:3000`)

## Login de teste

Usa os mesmos usuários do seed da API (ver README dela) — por exemplo:

| Papel | E-mail | Senha |
|---|---|---|
| ADMIN | `admin@helpdesk.com` | `password123` |
| REQUESTER | `solicitante1@helpdesk.com` | `password123` |

## Como o front fala com a API

O JWT emitido pela API fica guardado num cookie `httpOnly` (nunca chega ao JavaScript do navegador — ver `src/lib/dal.ts`). Por isso, tudo que precisa do token roda no servidor: Server Components, Server Actions, e duas rotas-proxy (`src/app/api/tickets/report`, `src/app/api/tickets/stats`) que existem só para os poucos casos em que o próprio navegador precisa chamar algo (baixar o relatório, fazer *polling* do indicador em tempo real).

## Scripts

```bash
npm run dev     # Servidor de desenvolvimento (Turbopack)
npm run build   # Build de produção
npm run start   # Serve o build de produção
npm run lint    # ESLint
```
