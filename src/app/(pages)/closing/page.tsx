'use client'

import { Card } from '@/components/Card'
import MainHeader from '@/layouts/mainHeader'
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
  Calendar,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  DollarSign,
  Eraser,
  PlusCircle,
  Printer,
  Search,
  XCircle,
} from 'lucide-react'
import { Key, useEffect, useState } from 'react'
import { Closing } from '@/types/closing'
import { format } from 'date-fns'
import { PDFProps, handleCreateClosingPdf } from '@/functions/auxiliar'
import { useUser } from '@/app/contexts/useUser'

export default function Closing() {
  const [loading, setLoading] = useState(false)
  const [closings, setClosings] = useState<Closing[]>()
  const { auth } = useUser()

  useEffect(() => {
    if (typeof window !== 'undefined' && auth?.token) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/list/closing`, {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        })
        .then((response) => {
          setClosings(response.data)
        })
        .catch((error) => {
          if (error) {
            console.log(error)
          }
        })
    }
  }, [auth?.token])

  const handleChangeClosingStatus = (
    status: 'Aberto' | 'Pago' | 'Cancelado',
    id: string,
  ) => {
    if (typeof window !== 'undefined' && auth?.token) {
      const body = {
        id,
        status,
      }

      axios
        .put(`${process.env.NEXT_PUBLIC_API_URL}/update/closing/status`, body, {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        })
        .then((response) => {
          setClosings(response.data)
        })
        .catch((error) => {
          if (error) {
            console.log(error)
          }
        })
    }
  }

  const handlePrintReport = async (
    startDate: string,
    endDate: string,
    clientId: string,
    projectId: string,
  ) => {
    const body: PDFProps = {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      clientId,
      selectedProjects: [projectId],
    }

    if (auth?.token) {
      await handleCreateClosingPdf(body, auth?.token, setLoading)
    }
  }

  const handleClosingCardClick = (key: Key, id: string, closing: Closing) => {
    if (key === 'cancel') {
      handleChangeClosingStatus('Cancelado', id)
    }

    if (key === 'paid') {
      handleChangeClosingStatus('Pago', id)
    }

    if (key === 'print') {
      handlePrintReport(
        closing.startDate,
        closing.endDate,
        closing.clientId,
        closing.projectId,
      )
    }
  }

  return (
    <main className="max-w-7xl w-full  flex flex-col px-6 py-14 gap-16 flex-1">
      <MainHeader
        buttonLabel="Criar fechamento"
        route="/closing/create"
        title="Fechamento mensal"
      />

      <header className="flex items-center justify-between gap-6">
        <Input
          placeholder="Buscar"
          startContent={<Search className="w-5 h-5 text-gray-300" />}
          classNames={{
            label: 'font-semibold text-gray-300',
            inputWrapper:
              'bg-transparent border border-1 rounded-lg border-gray-300 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 px-4 py-2',
          }}
          // onValueChange={(search) => onStatusFilter({ search })}
        />

        <Dropdown
          classNames={{
            base: 'bg-gray-700 rounded-lg  min-w-fit',
          }}
          backdrop="opaque"
        >
          <DropdownTrigger>
            <Button
              className="rounded-lg min-w-fit border-2 border-dashed bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:border-solid hover:font-bold"
              startContent={<PlusCircle size={18} />}
            >
              Status
            </Button>
          </DropdownTrigger>

          <DropdownMenu
            // onAction={(status) => onStatusFilter({ status })}
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
                    icon={XCircle}
                  />
                }
                key={'false'}
              >
                Inativo
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
                Ativo
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
        {closings &&
          closings.map((closing) => {
            if (!closing.hide) {
              return (
                <Dropdown
                  classNames={{
                    base: 'bg-gray-700 rounded-lg w-full flex-1',
                  }}
                  backdrop="opaque"
                  key={closing.id}
                >
                  <DropdownTrigger>
                    <Button className="p-0 rounded-none h-fit  bg-transparent flex-1 min-w-fit">
                      <Card.Root className="hover:bg-gray-600 hover:border-2 hover:border-gray-500 items-stretch">
                        <Card.Header>
                          <Card.Title
                            label={`[${closing.client.fantasyName}] - ${closing.project.name}`}
                          />
                          <Card.Badge
                            className={
                              closing.status === 'Aberto'
                                ? 'text-blue-500 bg-blue-500/10'
                                : closing.status === 'Pago'
                                ? 'text-green-500 bg-green-500/10'
                                : 'text-gray-300/80 bg-gray-500/10'
                            }
                            status={closing.status}
                          />
                        </Card.Header>
                        <Card.Content>
                          <Card.Info
                            icon={DollarSign}
                            info={`${closing.totalValue}`}
                          />

                          <Card.Info
                            icon={Clock}
                            info={`${closing.totalValidatedHours}h`}
                          />

                          <Card.Info
                            icon={Calendar}
                            info={`${format(
                              new Date(closing.startDate),
                              'dd/MM/yyyy',
                            )} - ${format(
                              new Date(closing.endDate),
                              'dd/MM/yyyy',
                            )}`}
                          />
                        </Card.Content>
                      </Card.Root>
                    </Button>
                  </DropdownTrigger>

                  <DropdownMenu
                    itemClasses={{
                      base: 'rounded-lg data-[hover=true]:bg-gray-800 data-[hover=true]:text-gray-200 data-[selected=true]:text-gray-100 data-[selected=true]:font-bold',
                    }}
                    onAction={(key: Key) =>
                      handleClosingCardClick(key, closing.id, closing)
                    }
                  >
                    <DropdownItem
                      startContent={
                        <Card.Badge
                          status=""
                          className="text-blue-500 bg-blue-500/10  py-2 px-2 rounded-md"
                          icon={Printer}
                        />
                      }
                      key={'print'}
                    >
                      Imprimir faturamento
                    </DropdownItem>

                    <DropdownItem
                      startContent={
                        <Card.Badge
                          status=""
                          className="text-green-500 bg-green-500/10  py-2 px-2 rounded-md"
                          icon={CircleDollarSign}
                        />
                      }
                      key={'paid'}
                    >
                      Faturamento pago
                    </DropdownItem>

                    <DropdownItem
                      startContent={
                        <Card.Badge
                          status=""
                          className="text-gray-300/80 bg-gray-500/10  py-2 px-2 rounded-md"
                          icon={XCircle}
                        />
                      }
                      key={'cancel'}
                    >
                      Cancelar faturamento
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )
            }

            return null
          })}
      </section>
    </main>
  )
}
