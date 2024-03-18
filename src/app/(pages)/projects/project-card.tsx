import { useUser } from '@/app/contexts/useUser'
import { Card } from '@/components/Card'
import { updateProjectStatus } from '@/functions/requests'
import { Project } from '@/types/projects'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import { format } from 'date-fns'
import {
  AlertCircle,
  ArrowRightCircle,
  CheckCircle2,
  XCircle,
  Building2,
  PencilLine,
  CircleDashed,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Dispatch, Key, SetStateAction } from 'react'

export interface ProjectCardProps {
  project: Project
  setProjects: Dispatch<SetStateAction<Project[]>>
}

export function ProjectCard({ project, setProjects }: ProjectCardProps) {
  const { auth } = useUser()
  const router = useRouter()

  const handleChangeProjectStatus = async (
    key: Key,
    id: string,
    status?: 'NaoIniciado' | 'Iniciado' | 'Finalizado' | 'Cancelado',
  ) => {
    if (key === 'status' && typeof window !== 'undefined') {
      const body = {
        projectId: id,
        status: status ?? 'NaoIniciado',
      }

      const response = await updateProjectStatus(auth?.token, body)
      setProjects(response)
    }
  }

  const handleProjectCardClick = (
    key: Key,
    id: string | undefined,
    status?: 'NaoIniciado' | 'Iniciado' | 'Finalizado' | 'Cancelado',
  ) => {
    if (key === 'edit' && id) {
      handleEdit(id)
    }

    if (key === 'status' && id) {
      switch (status) {
        case 'NaoIniciado':
          handleChangeProjectStatus(key, id, 'Iniciado')
          break
        case 'Iniciado':
          handleChangeProjectStatus(key, id, 'Finalizado')
          break
      }
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/projects/create?id=${id}`)
  }

  return (
    project && (
      <Dropdown
        classNames={{
          base: 'bg-gray-700 rounded-lg w-full flex-1',
        }}
        backdrop="opaque"
      >
        <DropdownTrigger>
          <Button className="p-0 rounded-none h-fit flex-1 bg-transparent min-w-fit">
            <Card.Root className="hover:bg-gray-600 hover:border-2 hover:border-gray-500 items-stretch min-w-fit">
              <Card.Header>
                <section className="flex items-center gap-2">
                  <Card.Title label={project.name} />
                </section>
                <Card.Badge
                  className={
                    project.status === 'NaoIniciado'
                      ? 'text-red-500 bg-red-500/10'
                      : project.status === 'Iniciado'
                      ? 'text-orange-600 bg-orange-500/10'
                      : project.status === 'Finalizado'
                      ? 'text-green-500 bg-green-500/10'
                      : 'text-gray-300/80 bg-gray-500/10'
                  }
                  status={
                    project.status === 'NaoIniciado'
                      ? 'Não iniciado'
                      : project.status
                  }
                  icon={
                    project.status === 'NaoIniciado'
                      ? AlertCircle
                      : project.status === 'Iniciado'
                      ? ArrowRightCircle
                      : project.status === 'Finalizado'
                      ? CheckCircle2
                      : XCircle
                  }
                />
              </Card.Header>
              <Card.Content>
                <Card.Info
                  icon={Building2}
                  info={project.client?.fantasyName || ''}
                />
                <Card.Badge
                  className="text-gray-300/80 rounded-md bg-gray-500/20"
                  status={format(new Date(project?.startDate), 'dd/LL/yyyy')}
                />
              </Card.Content>
            </Card.Root>
          </Button>
        </DropdownTrigger>

        {auth?.user?.groupId === 1 &&
          project.status &&
          !['Finalizado', 'Cancelado'].includes(project.status) && (
            <DropdownMenu
              itemClasses={{
                base: 'rounded-lg data-[hover=true]:bg-gray-800 data-[hover=true]:text-gray-200 data-[selected=true]:text-gray-100 data-[selected=true]:font-bold',
              }}
              onAction={(key: Key) =>
                handleProjectCardClick(key, project.id, project?.status)
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
                    pathname: '/projects/create',
                    query: {
                      id: project.id,
                    },
                  }}
                >
                  Editar projeto
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
                Alterar status do projeto
              </DropdownItem>
            </DropdownMenu>
          )}
      </Dropdown>
    )
  )
}
