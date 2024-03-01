import { ServiceOrderCard } from '@/types/service-order'
import { Input } from '@nextui-org/react'
import { Search } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

export interface OsSearchFilterProps {
  setServiceOrders: Dispatch<SetStateAction<ServiceOrderCard[]>>
  serviceOrders: ServiceOrderCard[]
}

export function OsSearchFilter({
  serviceOrders,
  setServiceOrders,
}: OsSearchFilterProps) {
  const onStatusFilter = ({ search = '' }: { search?: string }) => {
    const newFilteredServiceOrders = serviceOrders.map((serviceOrder) => {
      serviceOrder.hide = true

      if (search) {
        if (serviceOrder.client.fantasyName.toLowerCase().includes(search)) {
          serviceOrder.hide = false
        }
      }

      if (!search) {
        serviceOrder.hide = false
      }

      return serviceOrder
    })

    setServiceOrders(newFilteredServiceOrders)
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
