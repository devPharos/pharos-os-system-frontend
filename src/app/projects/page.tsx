'use client'

import { Card } from '@/components/Card'
import ProjectTable from '@/components/tables/projects'
import Header from '@/layouts/header'
import PageHeader from '@/layouts/page-header'
import { Client } from '@/types/client'
import { Project } from '@/types/projects'
import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Input,
  Link,
} from '@nextui-org/react'
import axios from 'axios'
import { format } from 'date-fns'
import {
  Search,
  PlusCircle,
  Pencil,
  AlertCircle,
  ArrowRightCircle,
  CheckCircle2,
  CircleDollarSign,
  Eraser,
  User,
  Clock,
  Building2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const router = useRouter()

  useEffect(() => {
    if (window !== undefined) {
      const localStorage = window.localStorage
      const token = localStorage.getItem('access_token')

      axios
        .get('http://localhost:3333/projects', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setProjects(response.data.projects)
        })

      axios
        .get('http://localhost:3333/clients', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setClients(response.data)
        })
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <main className="max-w-7xl w-full  flex flex-col px-6 py-14 gap-16 flex-1">
        <header className="flex items-center justify-between">
          <section className="flex flex-col">
            <span className="font-bold text-2xl text-white">Projetos</span>
            <span className="text-gray-300">Gerencie todos os projetos</span>
          </section>

          <Button
            className="rounded-full px-6 py-4 text-gray-700 font-bold bg-yellow-500 hover:bg-yellow-600"
            onClick={() => router.push('/projects/create')}
          >
            <PlusCircle size={18} className="text-gray-700" />
            Adicionar projeto
          </Button>
        </header>

        <header className="flex items-center justify-between">
          <section className="flex w-6/12 gap-6">
            <Input
              placeholder="Buscar"
              startContent={<Search className="w-5 h-5 text-gray-300" />}
              classNames={{
                label: 'font-semibold text-gray-300',
                inputWrapper:
                  'bg-transparent border border-1 rounded-lg border-gray-300 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 px-4 py-2',
              }}
            />

            <Dropdown
              classNames={{
                base: 'bg-gray-700 rounded-lg',
              }}
              backdrop="opaque"
            >
              <DropdownTrigger>
                <Button
                  className="rounded-lg border-2 border-dashed bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:border-solid hover:font-bold"
                  startContent={<PlusCircle size={40} />}
                >
                  Status
                </Button>
              </DropdownTrigger>

              <DropdownMenu
                // onAction={(key) => onStatusFilter(key)}
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
          </section>
        </header>

        <section className="flex flex-wrap gap-6">
          {projects &&
            projects.map((project, index) => {
              const client = clients.find(
                (client) => client.id === project.clientId,
              )

              return (
                <Link href="" key={index}>
                  <Card.Root className="hover:bg-gray-600 hover:border-2 hover:border-gray-500 min-w-fit max-w-sm p-4">
                    <Card.Header>
                      <section className="flex items-center gap-2">
                        <Card.Title label={project.name} />
                      </section>
                      <Card.Badge
                        className={'text-gray-300/80 bg-gray-500/10'}
                        status={'Em aberto'}
                        icon={ArrowRightCircle}
                      />
                    </Card.Header>
                    <Card.Content>
                      <Card.Info
                        icon={Building2}
                        info={client?.fantasyName || ''}
                      />
                      <Card.Badge
                        className="text-gray-300/80 rounded-md bg-gray-500/20"
                        status={format(
                          new Date(project?.startDate),
                          'dd/LL/yyyy',
                        )}
                      />
                    </Card.Content>
                  </Card.Root>
                </Link>
              )
            })}
        </section>
      </main>
    </div>
  )
}
