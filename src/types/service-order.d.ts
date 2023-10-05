import { ProjectDetails } from './projects'

export interface ServiceOrderExpense {
  projectExpenseId: string
  value: string
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
  status: 'Aberto' | 'Enviado' | 'Faturado' | 'Cancelado'
}
