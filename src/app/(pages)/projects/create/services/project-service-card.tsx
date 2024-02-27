import { Card } from '@/components/Card'
import { Trash2 } from 'lucide-react'
import { ProjectServices } from '.'
import { ServiceOpened } from '@/app/hooks/useProjects'
import { Dispatch, SetStateAction } from 'react'

export interface ProjectServiceCardProps {
  service: ProjectServices
  services: ProjectServices[]
  setServices: Dispatch<SetStateAction<ProjectServices[]>>
  setServiceOpened: Dispatch<SetStateAction<ServiceOpened | undefined>>
  setOpenService: Dispatch<SetStateAction<boolean>>
  index: number
}

export function ProjectServiceCard({
  service,
  index,
  services,
  setOpenService,
  setServiceOpened,
  setServices,
}: ProjectServiceCardProps) {
  function handleOpenServiceForm() {
    const openedService = {
      ...service,
      index,
    }

    setServiceOpened(openedService)
    setOpenService(true)
  }

  function handleDeleteService() {
    const newServicesList = [...services]
    newServicesList[index] = {
      ...service,
      deleted: true,
    }

    setServices(newServicesList)
  }

  return (
    <main className="flex items-center gap-6 justify-center bg-gray-700 px-5 py-4 max-w-fit rounded-lg">
      <span
        onClick={handleOpenServiceForm}
        className="text-sm text-gray-300 cursor-pointer"
      >
        {service.description}
      </span>
      <Card.Badge
        status=""
        icon={Trash2}
        className=" text-red-500 bg-red-500/10 py-2 cursor-pointer px-2 rounded-md"
        onClick={handleDeleteService}
      />
    </main>
  )
}
