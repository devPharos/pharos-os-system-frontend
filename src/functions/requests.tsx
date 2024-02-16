import { Client } from '@/types/client'
import axios from 'axios'

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
