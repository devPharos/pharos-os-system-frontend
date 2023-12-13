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

export interface Project {
  id?: string
  clientId: string
  coordinatorId: string
  name: string
  startDate: Date
  status: 'NaoIniciado' | 'Iniciado' | 'Finalizado' | 'Cancelado'
  hide?: boolean
  endDate: Date | undefined
  deliveryForecast: Date
  hoursForecast: string
  hoursBalance: string | undefined
  hourValue: string
  projectExpenses: Partial<ProjectExpenses>[]
  projectServices: Partial<ProjectServices>[]
}
