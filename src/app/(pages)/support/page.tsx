'use client'
import { Card } from '@/components/Card'
import { useRegister } from '@/hooks/useRegister'
import Header from '@/layouts/header'
import { SupportTicket } from '@/types/support'
import { UserData } from '@/types/user'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Input,
} from '@nextui-org/react'
import axios from 'axios'
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowRightCircle,
  ArrowUp,
  Building2,
  CheckCircle2,
  Eraser,
  GaugeCircle,
  PlusCircle,
  Search,
  Trash,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Key, useEffect, useState } from 'react'

export default function Support() {
  const router = useRouter()
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const { token } = useRegister()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/list/tickets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTickets(response.data)
        })
    }
  }, [])

  const onStatusFilter = ({
    status = null,
    priority = null,
    search = '',
  }: {
    status?: Key | null
    priority?: Key | null
    search?: string
  }) => {
    const newFilteredTickets = tickets.map((ticket) => {
      ticket.hide = true

      if (status) {
        if (status === ticket.status || status === 'Limpar') {
          ticket.hide = false
        }
      }

      if (priority) {
        if (priority === ticket.priority) {
          ticket.hide = false
        }
      }

      if (search) {
        if (ticket.title.includes(search)) {
          ticket.hide = false
        }
      }

      if (!search && !status) {
        ticket.hide = false
      }

      return ticket
    })

    setTickets(newFilteredTickets)
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <main className="max-w-7xl w-full  flex flex-col px-6 py-14 gap-16 flex-1">
        <header className="flex items-center justify-between">
          <section className="flex flex-col">
            <span className="font-bold text-2xl text-white">Suporte</span>
            <span className="text-gray-300">
              Gerencie todos os tickets em seu nome
            </span>
          </section>

          <Button
            className="rounded-full px-6 py-4 text-gray-700 font-bold bg-yellow-500 hover:bg-yellow-600"
            onClick={() => router.push('/support/create')}
          >
            <PlusCircle size={18} className="text-gray-700" />
            Abrir ticket
          </Button>
        </header>

        <header className="flex items-center gap-6">
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
                className="rounded-lg border-2 min-w-fit border-dashed bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:border-solid hover:font-bold"
                startContent={<PlusCircle size={18} />}
              >
                Status
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
                      icon={AlertCircle}
                    />
                  }
                  key={'Atraso'}
                >
                  Em atraso
                </DropdownItem>

                <DropdownItem
                  startContent={
                    <Card.Badge
                      status=""
                      className="text-blue-500 bg-blue-500/10 py-2 px-2 rounded-md"
                      icon={GaugeCircle}
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

          <Dropdown
            classNames={{
              base: 'bg-gray-700 rounded-lg',
            }}
            backdrop="opaque"
          >
            <DropdownTrigger>
              <Button
                className="rounded-lg min-w-fit border-2 border-dashed bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:border-solid hover:font-bold"
                startContent={<PlusCircle size={18} />}
              >
                Prioridade
              </Button>
            </DropdownTrigger>

            <DropdownMenu
              onAction={(priority) => onStatusFilter({ priority })}
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
                      icon={ArrowUp}
                    />
                  }
                  key={'Alta'}
                >
                  Alta
                </DropdownItem>

                <DropdownItem
                  startContent={
                    <Card.Badge
                      status=""
                      className="text-orange-600 bg-orange-500/10 py-2 px-2 rounded-md"
                      icon={ArrowRight}
                    />
                  }
                  key={'Media'}
                >
                  Média
                </DropdownItem>

                <DropdownItem
                  startContent={
                    <Card.Badge
                      status=""
                      className="text-blue-600 bg-blue-500/10 py-2 px-2 rounded-md"
                      icon={ArrowDown}
                    />
                  }
                  key={'Baixa'}
                >
                  Baixa
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
        </header>

        <section className="flex flex-wrap w-full gap-6">
          {tickets &&
            tickets.map((ticket) => {
              if (!ticket.hide) {
                return (
                  <Link
                    href={{
                      pathname: '/support/ticket',
                      query: {
                        id: ticket.id,
                      },
                    }}
                    className="bg-gray-700 rounded-lg w-full flex-1"
                    key={ticket.id}
                  >
                    <Card.Root className="hover:bg-gray-600 hover:border-2 hover:border-gray-500 items-stretch min-w-fit">
                      <Card.Header>
                        <Card.Title label={ticket.title} />
                        <section className="flex gap-2">
                          <Card.Badge
                            className={
                              ticket.priority === 'Alta'
                                ? 'text-red-500'
                                : ticket.priority === 'Media'
                                ? 'text-orange-600'
                                : 'text-blue-500'
                            }
                            status={ticket.priority}
                            icon={
                              ticket.priority === 'Alta'
                                ? ArrowUp
                                : ticket.priority === 'Media'
                                ? ArrowRight
                                : ArrowDown
                            }
                          />
                        </section>
                      </Card.Header>
                      <Card.Content>
                        <section className="w-full flex items-center justify-between">
                          <Card.Info
                            icon={Building2}
                            info={ticket.client.fantasyName}
                          />

                          <section className="flex gap-1 items-center">
                            <Card.Badge
                              className={
                                'text-gray-200 bg-gray-300/10 min-h-fit'
                              }
                              status={
                                ticket.status === 'Atraso'
                                  ? 'Em atraso'
                                  : ticket.status === 'NaoIniciado'
                                  ? 'Não iniciado'
                                  : ticket.status
                              }
                            />

                            <Button
                              isIconOnly
                              className="bg-transparent hover:bg-gray-500 text-gray-100  hover:text-red-500"
                            >
                              <Trash size={16} />
                            </Button>
                          </section>
                        </section>
                      </Card.Content>
                    </Card.Root>
                  </Link>
                )
              } else {
                return null
              }
            })}
        </section>
      </main>
    </div>
  )
}
