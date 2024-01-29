export interface ClosingProject {
  name: string
}

export interface ClosingClient {
  fantasyName: string
}

export interface Closing {
  id: string
  clientId: string
  projectId: string
  startDate: string
  endDate: string
  totalValidatedHours: string
  totalValue: string
  expensesTotalValue: string
  taxTotalValue: string
  status: 'Aberto' | 'Cancelado' | 'Pago'
  paymentDate: string
  hide?: boolean
  project: ClosingProject
  client: ClosingClient
}
