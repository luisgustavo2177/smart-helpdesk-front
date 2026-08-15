export type Role = 'ADMIN' | 'REQUESTER'
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH'
export type ClassificationOrigin = 'AI' | 'MANUAL'

export type UserSummary = {
  id: number
  name: string
  email: string
}

export type User = UserSummary & {
  role: Role
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type Category = {
  id: number
  name: string
  status: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type Comment = {
  id: number
  ticketId: number
  authorId: number
  content: string
  createdAt: string
  author?: UserSummary
}

export type TicketStatusHistory = {
  id: number
  ticketId: number
  changedById: number
  previousStatus: TicketStatus | null
  newStatus: TicketStatus
  createdAt: string
  changedBy?: UserSummary
}

export type Ticket = {
  id: number
  title: string
  description: string
  categoryId: number
  suggestedCategoryId: number | null
  priority: TicketPriority
  suggestedPriority: TicketPriority | null
  classificationOrigin: ClassificationOrigin
  status: TicketStatus
  requesterId: number
  assigneeId: number | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  category?: Category
  suggestedCategory?: Category | null
  requester?: UserSummary
  assignee?: UserSummary | null
  comments?: Comment[]
  statusHistories?: TicketStatusHistory[]
}

export type PaginationMeta = {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
  firstPageUrl: string
  lastPageUrl: string
  nextPageUrl: string | null
  previousPageUrl: string | null
}

export type Paginated<T> = {
  meta: PaginationMeta
  data: T[]
}

export type TicketStats = {
  total: number
  statuses: Array<{
    status: TicketStatus
    count: number
    percentage: number
  }>
}
