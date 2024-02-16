import { Card } from '@/components/Card'
import { Project } from '@/types/projects'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@nextui-org/react'
import {
  PlusCircle,
  AlertCircle,
  ArrowRightCircle,
  CheckCircle2,
  XCircle,
  Eraser,
} from 'lucide-react'
import { Dispatch, Key, SetStateAction, useState } from 'react'

export interface ProjectStatusFilterProps {
  projects: Project[]
  setProjects: Dispatch<SetStateAction<Project[]>>
}

export function ProjectStatusFilter({
  projects,
  setProjects,
}: ProjectStatusFilterProps) {
  const [actualFilter, setActualFilter] = useState<
    'none' | 'NaoIniciado' | 'Iniciado' | 'Finalizado' | 'Cancelado'
  >('none')

  const onFilter = ({ status = null }: { status?: Key | null }) => {
    const filteredItem = projects.map((item) => {
      item.hide = true

      if (status) {
        if (item.status === status || status === 'Limpar') {
          item.hide = false

          if (status === 'Limpar') {
            setActualFilter('none')
          } else {
            setActualFilter(status)
          }
        }
      }

      if (!status) {
        item.hide = false
      }

      return item
    })

    setProjects(filteredItem)
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
          startContent={
            actualFilter === 'none' ? (
              <PlusCircle size={18} />
            ) : actualFilter === 'NaoIniciado' ? (
              <Card.Badge
                status=""
                className="text-red-500 bg-red-500/10 py-2 px-2 rounded-md"
                icon={AlertCircle}
              />
            ) : actualFilter === 'Iniciado' ? (
              <Card.Badge
                status=""
                className="text-orange-600 bg-orange-500/10 py-2 px-2 rounded-md"
                icon={ArrowRightCircle}
              />
            ) : actualFilter === 'Finalizado' ? (
              <Card.Badge
                status=""
                className="text-green-500 bg-green-500/10 py-2 px-2 rounded-md"
                icon={CheckCircle2}
              />
            ) : (
              <Card.Badge
                status=""
                className="text-gray-300/80 bg-gray-500/10 py-2 px-2 rounded-md"
                icon={XCircle}
              />
            )
          }
        >
          {actualFilter === 'none'
            ? 'Status'
            : actualFilter === 'NaoIniciado'
            ? 'Não iniciado'
            : actualFilter}
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        onAction={(status) => onFilter({ status })}
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
                icon={AlertCircle}
              />
            }
            key={'NaoIniciado'}
          >
            Não iniciado
          </DropdownItem>

          <DropdownItem
            startContent={
              <Card.Badge
                status=""
                className="text-orange-600 bg-orange-500/10 py-2 px-2 rounded-md"
                icon={ArrowRightCircle}
              />
            }
            key={'Iniciado'}
          >
            Iniciado
          </DropdownItem>

          <DropdownItem
            startContent={
              <Card.Badge
                status=""
                className="text-green-500 bg-green-500/10 py-2 px-2 rounded-md"
                icon={CheckCircle2}
              />
            }
            key={'Finalizado'}
          >
            Finalizado
          </DropdownItem>

          <DropdownItem
            startContent={
              <Card.Badge
                status=""
                className="text-gray-300/80 bg-gray-500/10 py-2 px-2 rounded-md"
                icon={XCircle}
              />
            }
            key={'Cancelado'}
          >
            Cancelado
          </DropdownItem>
        </DropdownSection>

        <DropdownSection>
          <DropdownItem
            startContent={
              <Card.Badge
                status=""
                className="bg-blue-500/10 text-blue-500 py-2 px-2 rounded-md"
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
