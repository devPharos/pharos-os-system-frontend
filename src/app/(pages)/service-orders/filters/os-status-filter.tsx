import { Card } from '@/components/Card'
import { ServiceOrderCard } from '@/types/service-order'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@nextui-org/react'
import {
  AlertCircle,
  ArrowRightCircle,
  CheckCircle2,
  CircleDollarSign,
  Eraser,
  Pencil,
  PlusCircle,
} from 'lucide-react'
import { Dispatch, Key, SetStateAction } from 'react'

export interface OsStatusFilterProps {
  setServiceOrders: Dispatch<SetStateAction<ServiceOrderCard[]>>
  serviceOrders: ServiceOrderCard[]
}

export function OsStatusFilter({
  serviceOrders,
  setServiceOrders,
}: OsStatusFilterProps) {
  const onStatusFilter = ({ status = null }: { status?: Key | null }) => {
    const newFilteredServiceOrders = serviceOrders.map((serviceOrder) => {
      serviceOrder.hide = true

      if (status) {
        if (serviceOrder.status === status || status === 'Limpar') {
          serviceOrder.hide = false
        }
      }

      if (!status) {
        serviceOrder.hide = false
      }

      return serviceOrder
    })

    setServiceOrders(newFilteredServiceOrders)
  }

  return (
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
          Status
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        onAction={(key) => onStatusFilter({ status: key })}
        itemClasses={{
          base: 'rounded-lg data-[hover=true]:bg-gray-800 data-[hover=true]:text-gray-200 data-[selected=true]:text-gray-100 data-[selected=true]:font-bold',
        }}
      >
        <DropdownSection
          showDivider
          classNames={{
            divider: 'bg-gray-500',
          }}
        >
          <DropdownItem
            startContent={
              <Card.Badge
                status=""
                className="text-gray-300/80 bg-gray-500/10 py-2 px-2 rounded-md"
                icon={Pencil}
              />
            }
            key={'Rascunho'}
          >
            Rascunho
          </DropdownItem>

          <DropdownItem
            startContent={
              <Card.Badge
                status=""
                className="bg-yellow-500/10 text-yellow-500 py-2 px-2 rounded-md"
                icon={AlertCircle}
              />
            }
            key={'Aberto'}
          >
            Em aberto
          </DropdownItem>
          <DropdownItem
            startContent={
              <Card.Badge
                status=""
                className="bg-orange-600/10 text-orange-600 py-2 px-2 rounded-md"
                icon={ArrowRightCircle}
              />
            }
            key={'Enviado'}
          >
            Enviado ao cliente
          </DropdownItem>

          <DropdownItem
            startContent={
              <Card.Badge
                status=""
                className="bg-blue-500/10 text-blue-500 py-2 px-2 rounded-md"
                icon={CheckCircle2}
              />
            }
            key={'Validado'}
          >
            Validado
          </DropdownItem>

          <DropdownItem
            startContent={
              <Card.Badge
                status=""
                className="bg-green-500/10 text-green-500 py-2 px-2 rounded-md"
                icon={CircleDollarSign}
              />
            }
            key={'Faturado'}
          >
            Faturado
          </DropdownItem>
        </DropdownSection>

        <DropdownSection>
          <DropdownItem
            startContent={
              <Card.Badge
                status=""
                className="bg-red-500/10 text-red-500 py-2 px-2 rounded-md"
                icon={Eraser}
              />
            }
            key={'Limpar'}
          >
            Limpar filtros
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
