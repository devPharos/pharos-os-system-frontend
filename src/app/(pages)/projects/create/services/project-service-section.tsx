import { ProjectServiceCard } from './project-service-card'
import { ProjectServices } from '.'
import { Dispatch, SetStateAction } from 'react'
import { ServiceOpened } from '@/app/hooks/useProjects'

interface ProjectServiceSectionProps {
  services: ProjectServices[]
  setServices: Dispatch<SetStateAction<ProjectServices[]>>
  setServiceOpened: Dispatch<SetStateAction<ServiceOpened | undefined>>
  setOpenService: Dispatch<SetStateAction<boolean>>
}

export function ProjectServiceSection({
  services,
  setOpenService,
  setServiceOpened,
  setServices,
}: ProjectServiceSectionProps) {
  return (
    <section className="space-y-6">
      <span className="text-gray-200">Serviços do projeto</span>

      <section className="flex flex-wrap items-center gap-6">
        {services.map((service, index) => {
          if (!service.deleted) {
            return (
              <ProjectServiceCard
                services={services}
                setOpenService={setOpenService}
                setServiceOpened={setServiceOpened}
                setServices={setServices}
                service={service}
                index={index}
                key={index}
              />
            )
          }

          return null
        })}
      </section>
    </section>
  )
}
