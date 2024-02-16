import { Client } from '@/types/client'
import { Input } from '@nextui-org/react'
import { Search } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

export interface ClientSearchFilterProps {
  clients: Client[]
  setClients: Dispatch<SetStateAction<Client[]>>
}

export function ClientSearchFilter({
  clients,
  setClients,
}: ClientSearchFilterProps) {
  const onStatusFilter = ({ search = '' }: { search?: string }) => {
    const newFilteredClients = clients.map((client) => {
      client.hide = true

      if (search) {
        if (client.fantasyName.toLowerCase().includes(search)) {
          client.hide = false
        }
      }

      if (!search) {
        client.hide = false
      }

      return client
    })

    setClients(newFilteredClients)
  }

  return (
    <Input
      placeholder="Buscar"
      startContent={<Search className="w-5 h-5 text-gray-300" />}
      classNames={{
        label: 'font-semibold text-gray-300',
        inputWrapper:
          'bg-transparent border border-1 rounded-lg border-gray-300 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 px-4 py-2',
      }}
      onValueChange={(search) => onStatusFilter({ search })}
    />
  )
}
