import { CollaboratorFormSchema } from '@/app/(pages)/company/collaborators/page'
import { CreateCollaboratorUserSchema } from '@/app/(pages)/company/users/page'
import { Client } from '@/types/client'
import { Collaborator } from '@/types/collaborator'
import axios, { AxiosResponse } from 'axios'
import { toast } from 'sonner'

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

interface CreateCollaboratorType extends CollaboratorFormSchema {
  supervisorId: string | null
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
