import { Client } from '@/types/client'
import axios, { AxiosResponse } from 'axios'

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
