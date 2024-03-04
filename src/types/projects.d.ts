import { ProjectExpensesFormSchema } from '@/app/(pages)/projects/create/expenses'
import { ProjectServicesFormSchema } from '@/app/(pages)/projects/create/services'

export interface Projects {
  id: string
  companyId: string
  clientId: string
  coordinatorId: string
  name: string
  startDate: string
  endDate: string
  deliveryForecast: string
  hoursForecast: string
  hoursBalance: string
  hourValue: string
}
export interface ProjectServices {
  id: string
  companyId: string
  projectId: string
  description: string
  chargesClient: boolean
  passCollaborator: boolean
}
export interface ProjectExpenses {
  id: string
  companyId: string
  projectId: string
  description: string
  value: string
  requireReceipt: boolean
}

export interface ProjectDetails {
  projectName: string
  startDate: Date
  endDate: Date
  projectId: string
  projectServiceId: string
  description: string
  projectServiceType: string
  totalHours: number
}

export interface ProjectCollaborator {
  id: string
  name: string
}
export interface ProjectClient {
  id: string
  fantasyName: string
}

export interface Project {
  id?: string
  clientId: string
  coordinatorId: string
  name: string
  startDate: string
  status?: 'NaoIniciado' | 'Iniciado' | 'Finalizado' | 'Cancelado'
  hide?: boolean
  endDate: undefined | string
  deliveryForecast: string
  hoursForecast: string | undefined
  hoursBalance: string | undefined
  hourValue: string
  projectsExpenses: ProjectExpensesFormSchema[]
  projectsServices: ProjectServicesFormSchema[]
  collaborator?: ProjectCollaborator
  hoursToBeBilled?: number
  client?: ProjectClient
}

export interface ProjectFounded extends Project {
  client: ProjectClient
}
