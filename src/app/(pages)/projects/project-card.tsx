import { Card } from '@/components/Card'
import { Project } from '@/types/projects'
import { format } from 'date-fns'
import {
  AlertCircle,
  ArrowRightCircle,
  CheckCircle2,
  XCircle,
  Building2,
} from 'lucide-react'
import Link from 'next/link'

export interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={{
        pathname: '/projects/create',
        query: {
          id: project.id,
        },
      }}
      className="bg-gray-700 rounded-lg w-full flex-1 min-w-fit"
    >
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
              project.status === 'NaoIniciado' ? 'Não iniciado' : project.status
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
    </Link>
  )
}
