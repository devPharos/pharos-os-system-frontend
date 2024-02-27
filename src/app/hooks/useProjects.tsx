/* eslint-disable @typescript-eslint/no-empty-function */
'use client'
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'
import {
  ProjectServices,
  ProjectServicesFormSchema,
} from '../(pages)/projects/create/services'
import {
  ProjectExpenses,
  ProjectExpensesFormSchema,
} from '../(pages)/projects/create/expenses'
import { Project } from '@/types/projects'

export interface ServiceOpened extends ProjectServices {
  index: number
}

export interface ExpenseOpened extends ProjectExpenses {
  index: number
}

interface IProjectContext {
  openService: boolean
  setOpenService: Dispatch<SetStateAction<boolean>>
  services: ProjectServicesFormSchema[]
  setServices: Dispatch<SetStateAction<ProjectServicesFormSchema[]>>
  serviceOpened: ServiceOpened | undefined
  setServiceOpened: Dispatch<SetStateAction<ServiceOpened | undefined>>

  openExpense: boolean
  setOpenExpense: Dispatch<SetStateAction<boolean>>
  expenses: ProjectExpensesFormSchema[]
  setExpenses: Dispatch<SetStateAction<ProjectExpensesFormSchema[]>>
  expenseOpened: ExpenseOpened | undefined
  setExpenseOpened: Dispatch<SetStateAction<ExpenseOpened | undefined>>

  project: Project | undefined
  setProject: Dispatch<SetStateAction<Project | undefined>>
}

const defaultValue: IProjectContext = {
  openService: false,
  serviceOpened: undefined,
  services: [],
  setOpenService: () => {},
  setServiceOpened: () => {},
  setServices: () => {},
  openExpense: false,
  expenseOpened: undefined,
  expenses: [],
  setOpenExpense: () => {},
  setExpenseOpened: () => {},
  setExpenses: () => {},
  project: {
    clientId: '',
    coordinatorId: '',
    deliveryForecast: '',
    endDate: '',
    hoursBalance: '',
    hoursForecast: '',
    hourValue: '',
    name: '',
    projectsExpenses: [],
    projectsServices: [],
    startDate: '',
  },
  setProject: () => {},
}

export const ProjectContext = createContext<IProjectContext>(
  defaultValue as any,
)

const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [openService, setOpenService] = useState(false)
  const [services, setServices] = useState<ProjectServicesFormSchema[]>([])
  const [serviceOpened, setServiceOpened] = useState<ServiceOpened>()
  const [openExpense, setOpenExpense] = useState(false)
  const [expenses, setExpenses] = useState<ProjectExpensesFormSchema[]>([])
  const [expenseOpened, setExpenseOpened] = useState<ExpenseOpened>()
  const [project, setProject] = useState<Project>()

  return (
    <ProjectContext.Provider
      value={{
        serviceOpened,
        openService,
        setOpenService,
        services,
        setServiceOpened,
        setServices,
        expenseOpened,
        expenses,
        openExpense,
        setExpenseOpened,
        setExpenses,
        setOpenExpense,
        project,
        setProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

const useProjects = () => {
  const context = useContext(ProjectContext)

  return context
}

export { ProjectProvider, useProjects }
