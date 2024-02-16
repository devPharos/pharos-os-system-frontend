'use client'

import { useUser } from '@/app/contexts/useUser'
import { Card } from '@/components/Card'
import { updateClientStatus } from '@/functions/requests'
import { Client } from '@/types/client'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import { Building2, CircleDashed, PencilLine } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Dispatch, Key, SetStateAction } from 'react'
import Link from 'next/link'

export interface ClientCardProps {
  client: Client
  setClients: Dispatch<SetStateAction<Client[]>>
}

export function ClientCard({ client, setClients }: ClientCardProps) {
  const { auth } = useUser()
  const router = useRouter()

  const handleChangeClientStatus = async (
    key: Key,
    id: string,
    active: boolean | undefined,
  ) => {
    if (key === 'status' && typeof window !== 'undefined') {
      const body = {
        clientId: id,
        active: !active,
      }
      const response = await updateClientStatus(auth?.token, body)
      setClients(response)
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/clients/create?id=${id}`)
  }

  const handleClientCardClick = (
    key: Key,
    id: string,
    active: boolean | undefined,
  ) => {
    if (key === 'edit') {
      handleEdit(id)
    }

    if (key === 'status') {
      handleChangeClientStatus(key, id, active)
    }
  }

  return (
    <Dropdown
      classNames={{
        base: 'bg-gray-700 rounded-lg w-full flex-1',
      }}
      backdrop="opaque"
      key={client.cnpj}
    >
      <DropdownTrigger>
        <Button className="p-0 rounded-none h-fit  w-full  bg-transparent min-w-fit max-w-sm">
          <Card.Root className="hover:bg-gray-600 hover:border-2 hover:border-gray-500 min-w-fit max-w-sm">
            <Card.Header>
              <Card.Title label={client.fantasyName} />
              <Card.Badge
                className={
                  client.active
                    ? 'text-green-500 bg-green-500/10'
                    : 'text-red-500 bg-red-500/10'
                }
                status={client.active ? 'Ativo' : 'Inativo'}
              />
            </Card.Header>
            <Card.Content>
              <Card.Info icon={Building2} info={client.cnpj} />
              {!client.userId && (
                <Card.Badge
                  className="text-gray-300/80 bg-gray-500/10"
                  status={'Sem acesso'}
                />
              )}
            </Card.Content>
          </Card.Root>
        </Button>
      </DropdownTrigger>

      {auth?.user?.groupId === 1 && (
        <DropdownMenu
          itemClasses={{
            base: 'rounded-lg data-[hover=true]:bg-gray-800 data-[hover=true]:text-gray-200 data-[selected=true]:text-gray-100 data-[selected=true]:font-bold',
          }}
          onAction={(key: Key) =>
            handleClientCardClick(key, client.id, client?.active)
          }
        >
          <DropdownItem
            startContent={
              <Card.Badge
                status=""
                className="text-gray-300/80 bg-gray-500/10  py-2 px-2 rounded-md"
                icon={PencilLine}
              />
            }
            key={'edit'}
          >
            <Link
              href={{
                pathname: '/clients/create',
                query: {
                  id: client.id,
                },
              }}
            >
              Editar cliente
            </Link>
          </DropdownItem>

          <DropdownItem
            startContent={
              <Card.Badge
                status=""
                className="text-gray-300/80 bg-gray-500/10  py-2 px-2 rounded-md"
                icon={CircleDashed}
              />
            }
            key={'status'}
          >
            Alterar status do cliente
          </DropdownItem>
        </DropdownMenu>
      )}
    </Dropdown>
  )
}
