import { useUser } from '@/app/contexts/useUser'
import { Card } from '@/components/Card'
import { ServiceOrderCard } from '@/types/service-order'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import { Filter, PlusCircle } from 'lucide-react'
import { Dispatch, Key, SetStateAction, useEffect } from 'react'

export interface OsSupervisorFilterProps {
  setServiceOrders: Dispatch<SetStateAction<ServiceOrderCard[]>>
  serviceOrders: ServiceOrderCard[]
  items: {
    key: string
    label: string
  }[]
  setCollaborators: Dispatch<
    SetStateAction<
      {
        key: string
        label: string
      }[]
    >
  >
  setItems: Dispatch<
    SetStateAction<
      {
        key: string
        label: string
      }[]
    >
  >
}

export function OsSupervisorFilter({
  serviceOrders,
  setServiceOrders,
  items,
}: OsSupervisorFilterProps) {
  const { auth } = useUser()

  const onStatusFilter = ({
    supervisor = null,
  }: {
    supervisor?: Key | null
  }) => {
    const newFilteredServiceOrders = serviceOrders.map((serviceOrder) => {
      serviceOrder.hide = true

      if (supervisor) {
        if (serviceOrder.collaborator.id === supervisor) {
          serviceOrder.hide = false
        }

        if (supervisor === 'all') {
          serviceOrder.hide = false
        }

        if (supervisor === 'me') {
          if (serviceOrder.collaborator.id === auth?.user?.collaboratorId) {
            serviceOrder.hide = false
          }
        }
      }

      if (!supervisor) {
        serviceOrder.hide = false
      }

      return serviceOrder
    })

    setServiceOrders(newFilteredServiceOrders)
  }

  return (
    <>
      <Dropdown
        classNames={{
          base: 'bg-gray-700 rounded-lg',
        }}
        backdrop="opaque"
      >
        <DropdownTrigger>
          <Button
            className="rounded-lg min-w-fit border-2 border-dashed bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:border-solid hover:font-bold"
            startContent={<PlusCircle size={18} />}
          >
            Supervisor
          </Button>
        </DropdownTrigger>

        <DropdownMenu
          onAction={(key) => onStatusFilter({ supervisor: key })}
          itemClasses={{
            base: 'rounded-lg data-[hover=true]:bg-gray-800 data-[hover=true]:text-gray-200 data-[selected=true]:text-gray-100 data-[selected=true]:font-bold',
          }}
          items={items}
        >
          {(item: any) => (
            <DropdownItem
              key={item.key}
              startContent={
                <Card.Badge
                  status=""
                  className="text-gray-300/80 bg-gray-500/10 py-2 px-2 rounded-md"
                  icon={Filter}
                />
              }
            >
              {item.label}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </>
  )
}
