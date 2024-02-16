'use client'
import { useUser } from '@/app/contexts/useUser'
import { Card } from '@/components/Card'
import { Collaborator } from '@/types/collaborator'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import { PencilLine } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Key } from 'react'

export interface CompanyCardProps {
  collaborator: Collaborator
}

export function CompanyCard({ collaborator }: CompanyCardProps) {
  const { auth } = useUser()
  const router = useRouter()

  const handleEdit = (key: Key, id: string, userId: string | undefined) => {
    router.push(`/company/${key}?id=${key === 'collaborators' ? id : userId}`)
  }

  return (
    <Dropdown
      classNames={{
        base: 'bg-gray-700 rounded-lg w-full flex-1',
      }}
      backdrop="opaque"
      key={collaborator.id}
    >
      <DropdownTrigger>
        <Button className="p-0 rounded-none h-fit  w-full  bg-transparent min-w-fit max-w-sm">
          <Card.Root
            key={collaborator.id}
            className="hover:bg-gray-600 hover:border-2 hover:border-gray-500 items-stretch min-w-fit max-w-sm"
          >
            <Card.Header>
              <Card.Title
                label={collaborator.name + ' ' + collaborator.lastName}
              />
              <section className="flex items-center gap-2">
                {!collaborator.userId && (
                  <Card.Badge
                    className="text-blue-500 bg-blue-500/10"
                    status={'Sem acesso'}
                  />
                )}
              </section>
            </Card.Header>
          </Card.Root>
        </Button>
      </DropdownTrigger>

      {auth.user?.groupId === 1 && (
        <DropdownMenu
          itemClasses={{
            base: 'rounded-lg data-[hover=true]:bg-gray-800 data-[hover=true]:text-gray-200 data-[selected=true]:text-gray-100 data-[selected=true]:font-bold',
          }}
          onAction={(key: Key) =>
            handleEdit(key, collaborator.id, collaborator?.userId)
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
            key={'collaborators'}
          >
            Editar colaborador
          </DropdownItem>

          <DropdownItem
            startContent={
              <Card.Badge
                status=""
                className="text-gray-300/80 bg-gray-500/10  py-2 px-2 rounded-md"
                icon={PencilLine}
              />
            }
            key={'users'}
            className={!collaborator.userId ? 'hidden' : undefined}
          >
            Editar usuário
          </DropdownItem>
        </DropdownMenu>
      )}
    </Dropdown>
  )
}
