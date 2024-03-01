'use client'
import { PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { Client } from '@/types/client'
import { UserState, useUser } from '@/app/contexts/useUser'
import { ClientHeader } from './client-header'
import { getClients } from '@/functions/requests'
import { ClientCard } from './client-card'
import { ClientStatusFilter } from './filters/client-status-filter'
import { ClientSearchFilter } from './filters/client-search-filter'

export default function Clients() {
  const router = useRouter()
  const { auth }: { auth: UserState } = useUser()
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    async function fetchData() {
      const response = await getClients(auth?.token)
      setClients(response)
    }

    fetchData()
  }, [auth?.token])

  return (
    <>
      <main className="max-w-7xl w-full  flex flex-col px-6 py-14 gap-16 flex-1">
        <ClientHeader />

        <header className="flex items-center justify-between gap-6">
          <ClientSearchFilter clients={clients} setClients={setClients} />

          <ClientStatusFilter clients={clients} setClients={setClients} />

          {auth?.user?.groupId === 1 && (
            <Button
              onClick={() => router.push('/clients/users')}
              className="rounded-full px-6 py-4 hover:text-gray-700 text-yellow-500 font-bold border-dashed border-2 min-w-fit bg-transparent border-yellow-500 hover:bg-yellow-500"
            >
              <PlusCircle size={18} />
              Adicionar usuário
            </Button>
          )}
        </header>

        <section className="flex flex-wrap w-full gap-6">
          {clients.map((client) => {
            if (!client.hide) {
              return (
                <ClientCard
                  client={client}
                  setClients={setClients}
                  key={client.id}
                />
              )
            }

            return null
          })}
        </section>
      </main>
    </>
  )
}
