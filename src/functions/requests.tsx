import { CreateUserSchema } from '@/app/(pages)/clients/users/page'
import { CollaboratorFormSchema } from '@/app/(pages)/company/collaborators/page'
import { CreateCollaboratorUserSchema } from '@/app/(pages)/company/users/page'
import { Project } from '@/app/(pages)/projects/create/page'
import {
  ProjectExpenses,
  ProjectServices,
  Projects as ProjectType,
} from '@/types/projects'
import { Client } from '@/types/client'
import { Collaborator } from '@/types/collaborator'
import {
  ServiceOrderCard,
  ServiceOrderDate,
  ServiceOrderPage,
} from '@/types/service-order'
import axios, { AxiosResponse } from 'axios'
import { toast } from 'sonner'
import { OSDetails } from '@/app/(pages)/service-orders/create/details'
import { OS } from '@/app/(pages)/service-orders/create/os-form'

// * INTERFACES
interface CreateCollaboratorType extends CollaboratorFormSchema {
  supervisorId: string | null
}

// * CLIENTS
export async function getClients(token: string): Promise<Client[]> {
  let clients: Client[] = []

  await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(function (response) {
      clients = response.data
    })
    .catch(function (error) {
      console.log(error)
      toast.error('Erro ao buscar clientes')
    })

  return clients
}

export async function updateClientStatus(
  token: string,
  body: {
    clientId: string
    active: boolean
  },
): Promise<Client[]> {
  let clients: Client[] = []

  await axios
    .put(`${process.env.NEXT_PUBLIC_API_URL}/update/client/status`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(function (response) {
      clients = response.data
    })
    .catch(function (error) {
      console.error(error)
      toast.error('Erro ao atualizar status do cliente')
    })

  return clients
}

export async function createClient(
  token: string,
  data: Partial<Client>,
): Promise<AxiosResponse<void, void>> {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/accounts/client`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response
}

export async function updateClient(
  token: string,
  data: Partial<Client>,
): Promise<AxiosResponse<void, void>> {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/update/client`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response
}

export async function createClientUser(
  token: string,
  body: CreateUserSchema,
): Promise<AxiosResponse<void, void>> {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/accounts/user/client`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response
}

// * USER
export async function sendNewUserEmail(
  token: string,
  data: Partial<CreateUserSchema>,
): Promise<AxiosResponse<void, void>> {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/mail/user-created`,
    {
      email: data.email,
      password: data.password,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response
}

// * COLLABORATORS
export async function getCollaborators(token: string): Promise<Collaborator[]> {
  let collaborators: Collaborator[] = []

  await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/collaborators/data`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      collaborators = response.data
    })
    .catch((error) => {
      console.log(error)

      toast.error('Erro ao buscar colaboradores')
    })

  return collaborators
}

export async function getCollaboratorsWithNoAccess(
  token: string,
): Promise<Collaborator[]> {
  let collaborators: Collaborator[] = []

  await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/collaborators/no-access`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      collaborators = response.data
    })

  return collaborators
}

export async function createCollaboratorUser(
  token: string,
  body: CreateCollaboratorUserSchema,
): Promise<AxiosResponse<void, void>> {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/accounts/user`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response
}

export async function updateCollaboratorUser(
  token: string,
  body: {
    userId: string
    email: string
    password: string
  },
): Promise<AxiosResponse<void, void>> {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/update/user`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response
}

export async function getSupervisors(token: string): Promise<Collaborator[]> {
  let supervisors: Collaborator[] = []

  await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/list/supervisors`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(function (response) {
      supervisors = response.data
    })
    .catch(function (error) {
      console.error(error)
      toast.error('Erro ao buscar supervisores')
    })

  return supervisors
}

export async function createCollaborator(
  token: string,
  body: CreateCollaboratorType,
): Promise<AxiosResponse<void, void>> {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/accounts/collaborator`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response
}

export async function updateCollaborator(
  token: string,
  body: Partial<CreateCollaboratorType>,
): Promise<AxiosResponse<void, void>> {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/update/collaborator`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response
}

// * PROJECTS
export async function getProjects(
  token: string,
  clientId?: string,
): Promise<Project[]> {
  let projects: Project[] = []

  await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
        clientid: clientId,
      },
    })
    .then((response) => {
      projects = response.data.projects
    })
    .catch((error) => {
      console.log(error)
      toast.error('Erro ao buscar projetos')
    })

  return projects
}

export async function listProjects(token: string): Promise<ProjectType[]> {
  let projects: ProjectType[] = []

  await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/list/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      projects = response.data
    })
    .catch((error) => {
      console.log(error)
      toast.error('Erro ao buscar projetos')
    })

  return projects
}

export async function createProject(
  token: string,
  body: Project,
): Promise<AxiosResponse<void, void>> {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/projects`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response
}

export async function findProject(token: string, id: string): Promise<Project> {
  let project: Project = {
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
  }

  await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/find/project`, {
      headers: {
        Authorization: `Bearer ${token}`,
        id,
      },
    })
    .then((response) => {
      project = response.data
    })
    .catch((error) => {
      console.log(error)
      toast.error('Erro ao buscar projeto')
    })

  return project
}

export async function updateProject(
  token: string,
  body: Project,
  id: string,
): Promise<AxiosResponse<void, void>> {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/update/project`,
    {
      ...body,
      projectId: id,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response
}

export async function updateProjectStatus(
  token: string,
  body: {
    projectId: string
    status: 'NaoIniciado' | 'Iniciado' | 'Finalizado' | 'Cancelado'
  },
): Promise<Project[]> {
  let projects: Project[] = []

  await axios
    .put(`${process.env.NEXT_PUBLIC_API_URL}/update/project/status`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(function (response) {
      projects = response.data
    })
    .catch(function (error) {
      console.error(error)
      toast.error('Erro ao atualizar status do projeto')
    })

  return projects
}

export async function getProjectServices(
  token: string,
  projectId: string,
): Promise<ProjectServices[]> {
  let projectServices: ProjectServices[] = []

  await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/project-services`, {
      headers: {
        Authorization: `Bearer ${token}`,
        projectid: projectId,
      },
    })
    .then((response) => {
      projectServices = response.data.projectsServices
    })

  return projectServices
}

export async function getProjectExpenses(
  token: string,
  projectId: string,
): Promise<ProjectExpenses[]> {
  let projectExpenses: ProjectExpenses[] = []

  await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/project-expenses`, {
      headers: {
        Authorization: `Bearer ${token}`,
        projectid: projectId,
      },
    })
    .then((response) => {
      console.log(response.data)
      projectExpenses = response.data.projectExpenses
    })

  return projectExpenses
}

export async function deleteProjectService(
  token: string,
  serviceId: string,
  id: string,
): Promise<AxiosResponse<void, void>> {
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/delete/project/service`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        serviceid: serviceId,
        projectid: id,
      },
    },
  )

  return response
}

export async function deleteProjectExpense(
  token: string,
  expenseId: string,
  id: string,
): Promise<AxiosResponse<void, void>> {
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/delete/project/expense`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        expenseId,
        projectId: id,
      },
    },
  )

  return response
}

// * SERVICE ORDERS
export async function getServiceOrders(
  token: string,
): Promise<ServiceOrderCard[]> {
  let osList: ServiceOrderCard[] = []
  await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/list/service-orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.data !== '') {
        const os = [
          ...response.data.serviceOrders,
          ...response.data.serviceOrdersSupervisedByMe,
        ]

        osList = os
      }
    })
    .catch((error) => {
      console.log(error)
      toast.error("Erro ao buscar OS's")
    })

  return osList
}

export async function findServiceOrderById(
  token: string,
  id: string,
): Promise<OS> {
  let os: OS = {
    clientId: '',
    date: '',
    details: [],
    serviceType: '',
  }

  await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/find/service-order`, {
      headers: {
        Authorization: `Bearer ${token}`,
        id,
      },
    })
    .then((response) => {
      os = response.data
    })
    .catch((error) => {
      console.log(error)
      toast.error('Erro ao buscar OS')
    })

  return os
}

export async function getServiceOrdersFilters(
  token: string,
): Promise<ServiceOrderDate[]> {
  let filters: ServiceOrderDate[] = []

  await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/list/service-orders/filters`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => (filters = res.data))

  return filters
}

export async function createServiceOrder(
  token: string,
  body: {
    status: string
    details: OSDetails[]
    date: string
    clientId: string
    serviceType: string
  },
): Promise<AxiosResponse<void, void>> {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/service-order`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response
}

export async function updateServiceOrder(
  token: string,
  body: {
    status: string
    details: OSDetails[]
    date: string
    clientId: string
    serviceType: string
  },
): Promise<AxiosResponse<void, void>> {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/update/service-order`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response
}

export async function listServiceOrders(
  token: string,
  selectedValue?: string,
): Promise<ServiceOrderPage> {
  let serviceOrdersPage: ServiceOrderPage = {
    date: '',
    defaultDate: {
      date: '',
      formattedDate: '',
    },
    formattedDate: '',
    serviceOrders: [],
  }

  await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/list/service-orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
        filterDate: selectedValue,
      },
    })
    .then((response) => {
      const os: ServiceOrderCard[] = response.data.serviceOrders

      if (os) {
        const allOs: ServiceOrderCard[] = os
        allOs &&
          allOs.forEach((os) => {
            os.selected = false
          })

        os &&
          os.sort((a, b) => {
            const dataA = new Date(a.date).getTime()
            const dataB = new Date(b.date).getTime()

            return dataA - dataB
          })
      }

      serviceOrdersPage = {
        ...response.data,
        serviceOrders: os,
      }
    })

  return serviceOrdersPage
}

export async function updateServiceOrderStatus(
  token: string,
  status: 'Aberto' | 'Enviado' | 'Faturado' | 'Validado' | 'Rascunho',
  id: string,
) {
  const body = {
    id,
    status,
  }

  await axios
    .put(
      `${process.env.NEXT_PUBLIC_API_URL}/update/service-order/status`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then(() => {
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    })
}

export async function deleteServiceOrder(token: string, id: string) {
  await axios
    .delete(`${process.env.NEXT_PUBLIC_API_URL}/delete/service-order`, {
      headers: {
        Authorization: `Bearer ${token}`,
        id,
      },
    })
    .then(() => {
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    })
}
