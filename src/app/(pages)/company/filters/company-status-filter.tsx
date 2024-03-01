'use client'

import { Card } from '@/components/Card'
import { Collaborator } from '@/types/collaborator'
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

export interface CompanyStatusFilterProps {
  collaborators: Collaborator[]
  setCollaborators: Dispatch<SetStateAction<Collaborator[]>>
}

export function CompanyStatusFilter({
  collaborators,
  setCollaborators,
}: CompanyStatusFilterProps) {
  const [actualFilter, setActualFilter] = useState<
    'none' | 'access' | 'no-access'
  >('none')

  const onStatusFilter = ({ status = null }: { status?: Key | null }) => {
    const newFilteredClients = collaborators.map((collaborator) => {
      collaborator.hide = true

      if (status) {
        if (
          (status === 'false' && !collaborator.userId) ||
          (status === 'true' && collaborator.userId) ||
          status === 'Limpar'
        ) {
          collaborator.hide = false

          switch (status) {
            case 'true':
              setActualFilter('access')
              break
            case 'false':
              setActualFilter('no-access')
              break
            case 'Limpar':
              setActualFilter('none')
              break
          }
        }
      }

      if (!status) {
        collaborator.hide = false
      }

      return collaborator
    })

    setCollaborators(newFilteredClients)
  }

  return (
    <Dropdown
      classNames={{
        base: 'bg-gray-700 rounded-lg  min-w-fit',
      }}
      backdrop="opaque"
    >
      <DropdownTrigger>
        <Button
          className="rounded-lg min-w-fit border-2 border-dashed bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:border-solid hover:font-bold"
          startContent={
            actualFilter === 'access' ? (
              <Card.Badge
                status=""
                className="bg-green-500/10 text-green-500 py-2 px-2 rounded-md"
                icon={CheckCircle2}
              />
            ) : actualFilter === 'no-access' ? (
              <Card.Badge
                status=""
                className="text-blue-500 bg-blue-500/10 py-2 px-2 rounded-md"
                icon={XCircle}
              />
            ) : (
              <PlusCircle size={18} />
            )
          }
        >
          {actualFilter === 'access'
            ? 'Com acesso'
            : actualFilter === 'no-access'
            ? 'Sem acesso'
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
                className="text-blue-500 bg-blue-500/10 py-2 px-2 rounded-md"
                icon={XCircle}
              />
            }
            key={'false'}
          >
            Sem acesso
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
            Com acesso
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
