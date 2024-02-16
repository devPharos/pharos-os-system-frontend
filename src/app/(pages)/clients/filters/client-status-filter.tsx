import { Card } from '@/components/Card'
import { Client } from '@/types/client'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@nextui-org/react'
import { CheckCircle2, Eraser, PlusCircle, XCircle } from 'lucide-react'
import { Dispatch, Key, SetStateAction, useState } from 'react'

export interface ClientStatusFilterProps {
  clients: Client[]
  setClients: Dispatch<SetStateAction<Client[]>>
}

export function ClientStatusFilter({
  clients,
  setClients,
}: ClientStatusFilterProps) {
  const [actualFilter, setActualFilter] = useState<
    'none' | 'actives' | 'unactives'
  >('none')
  const onStatusFilter = ({ status = null }: { status?: Key | null }) => {
    const newFilteredClients = clients.map((client) => {
      client.hide = true

      if (status) {
        if (
          (status === 'false' && !client.active) ||
          (status === 'true' && client.active) ||
          status === 'Limpar'
        ) {
          client.hide = false

          switch (status) {
            case 'true':
              setActualFilter('actives')
              break
            case 'false':
              setActualFilter('unactives')
              break
            case 'Limpar':
              setActualFilter('none')
              break
          }
        }
      }

      if (!status) {
        client.hide = false
      }

      return client
    })

    setClients(newFilteredClients)
  }

  return (
    <Dropdown
      classNames={{
        base: 'bg-gray-700 rounded-lg min-w-fit',
      }}
      backdrop="opaque"
    >
      <DropdownTrigger>
        <Button
          className="rounded-lg min-w-fit border-2 border-dashed bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:border-solid hover:font-bold"
          startContent={
            actualFilter === 'actives' ? (
              <Card.Badge
                status=""
                className="bg-green-500/10 text-green-500 py-2 px-2 rounded-md"
                icon={CheckCircle2}
              />
            ) : actualFilter === 'unactives' ? (
              <Card.Badge
                status=""
                className="text-red-500 bg-red-500/10 py-2 px-2 rounded-md"
                icon={XCircle}
              />
            ) : (
              <PlusCircle size={18} />
            )
          }
        >
          {actualFilter === 'actives'
            ? 'Ativos'
            : actualFilter === 'unactives'
            ? 'Inativos'
            : 'Status'}
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        onAction={(status) => onStatusFilter({ status })}
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
                className="text-red-500 bg-red-500/10 py-2 px-2 rounded-md"
                icon={XCircle}
              />
            }
            key={'false'}
          >
            Inativo
          </DropdownItem>

          <DropdownItem
            startContent={
              <Card.Badge
                status=""
                className="bg-green-500/10 text-green-500 py-2 px-2 rounded-md"
                icon={CheckCircle2}
              />
            }
            key={'true'}
          >
            Ativo
          </DropdownItem>
        </DropdownSection>

        <DropdownSection>
          <DropdownItem
            startContent={
              <Card.Badge
                status=""
                className="text-gray-300/80 bg-gray-500/10 py-2 px-2 rounded-md"
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
