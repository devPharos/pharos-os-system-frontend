import { ProjectDetails } from './projects'

export interface ServiceOrderExpense {
  projectExpenseId: string
  value: string
  description?: string
}

export interface ServiceOrderDetails {
  projectDetails: ProjectDetails
  projectExpenses: ServiceOrderExpense[]
}

export interface ServiceOrderCreation {
  clientId: string
  collaboratorId: string
  companyId: string
  date: Date
  remote: boolean
  totalHours: string
  startDate: Date
  endDate: Date
  serviceOrderDetails: ServiceOrderDetails[]
}

export interface ServiceOrderCollaborator {
  name: string
  lastName: string
}

export interface ServiceOrderCard {
  id: string
  companyId: string
  collaboratorId: string
  remote: boolean | null
  clientId: string
  date: Date
  startDate: Date
  endDate: Date
  totalHours: string
  status: 'Aberto' | 'Enviado' | 'Faturado' | 'Validado' | 'Rascunho'
  clientName?: string
  selected?: boolean

  collaborator: ServiceOrderCollaborator
}

export interface ServiceOrder {
  id: string
  client: string
  clientId: string
  collaborator: string
  status: 'Aberto' | 'Enviado' | 'Faturado' | 'Cancelado'
  date: Date
  startDate: Date
  endDate: Date
  remote: boolean
  osDetails: ServiceOrderDetails[]
}
