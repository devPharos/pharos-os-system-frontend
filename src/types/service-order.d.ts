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
  supervisorId?: string
  id: string
}

export interface ServiceOrderDate {
  formattedDate: string
  date: string
}

export interface ServiceOrderClient {
  id: string
  fantasyName: string
  cnpj: string
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
  client: ServiceOrderClient
  hide?: boolean

  collaborator: ServiceOrderCollaborator
}

export interface ServiceOrderPage {
  serviceOrders: ServiceOrderCard
  serviceOrdersSupervisedByMe: ServiceOrderCard
  defaultDate: ServiceOrderDate
  formattedDate: string
  date: string
}

export interface ProjectExpenses {
  id: string
  requireReceipt?: string
  value: string
  description?: string
  serviceOrderExpenseId?: id
}

export interface ProjectServices {
  id?: string
  description?: string
}

export interface ServiceOrderExpenses {
  id?: string
  projectId?: string
  projectExpenses: ProjectExpenses
}

export interface ServiceOrderProject {
  id: string
  name: string
  projectsExpenses: ProjectExpenses[]
}
export interface ServiceOrderDetail {
  id?: string
  project: ServiceOrderProject
  projectServices: ProjectServices
  startDate: string
  endDate: string
  description: string
}

export interface ServiceOrder {
  id: string
  remote: boolean
  date: string
  fantasyName: string
  cnpj: string
  client: ServiceOrderClient
  clientId: string
  serviceOrderExpenses?: ServiceOrderExpenses[]
  serviceOrderDetails: ServiceOrderDetail[]
}
