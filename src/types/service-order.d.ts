import { ProjectDetails } from './projects'

export interface ServiceOrderExpense {
  projectExpenseId: string
  value: string
}

export interface ServiceOrderDetails {
  projectDetails: ProjectDetails
  projectExpenses: ServiceOrderExpense[]
}
