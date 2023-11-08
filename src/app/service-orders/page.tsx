'use client'
import { Card } from '@/components/Card'
import ServiceOrdersTable from '@/components/tables/service-orders'
import Header from '@/layouts/header'
import PageHeader from '@/layouts/page-header'
import { Client } from '@/types/client'
import { ServiceOrderCard } from '@/types/service-order'
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
import { format } from 'date-fns'
import {
  AlertCircle,
  ArrowRightCircle,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Eraser,
  Pencil,
  PlusCircle,
  Search,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { Key, useEffect, useState } from 'react'

export default function ServiceOrders() {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrderCard[]>([])
  const [filteredItems, setFilteredItems] = useState<ServiceOrderCard[]>([])
  const [clients, setClients] = useState<Client[]>([])

  const onStatusFilter = (status: Key) => {
    const newOsList = [...serviceOrders]

    if (status !== 'Limpar') {
      const filteredList = newOsList.filter((os) => os.status === status)
      setFilteredItems(filteredList)
    }

    if (status === 'Limpar') {
      setFilteredItems(newOsList)
    }
  }

  useEffect(() => {
    if (window !== undefined) {
      const localStorage = window.localStorage
      const userToken: string = localStorage.getItem('access_token') || ''

      axios
        .get('http://localhost:3333/service-orders', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((response) => {
          const allOs: ServiceOrderCard[] = response.data

          allOs.forEach((os) => {
            os.selected = false
          })

          setServiceOrders(response.data)
          setFilteredItems(response.data)
        })

      axios
        .get('http://localhost:3333/clients', {
          headers: {
            Authorization: `Bearer ${userToken}`,
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
        <PageHeader
          title="Ordens de serviço"
          subtitle="Gerencie todas suas ordens de serviço"
          label="Adicionar OS"
        />

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
                onAction={(key) => onStatusFilter(key)}
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
          {filteredItems.map((serviceOrder) => {
            const client = clients.find(
              (client) => client.id === serviceOrder.clientId,
            )
            return (
              <Link
                href={{
                  pathname: '/service-orders/create',
                  query: {
                    id: serviceOrder.id,
                  },
                }}
                key={serviceOrder.id}
              >
                <Card.Root className="hover:bg-gray-600 hover:border-2 hover:border-gray-500 min-w-fit max-w-sm p-4">
                  <Card.Header>
                    <section className="flex items-center gap-2">
                      <Card.Title label={client?.fantasyName || ''} />
                    </section>
                    <Card.Badge
                      className={
                        serviceOrder.status === 'Rascunho'
                          ? 'text-gray-300/80 bg-gray-500/10'
                          : serviceOrder.status === 'Aberto'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : serviceOrder.status === 'Enviado'
                          ? 'bg-orange-600/10 text-orange-600'
                          : serviceOrder.status === 'Faturado'
                          ? 'text-green-500/80 bg-green-500/10'
                          : 'bg-blue-500/10 text-blue-400'
                      }
                      status={
                        serviceOrder.status === 'Aberto'
                          ? 'Em aberto'
                          : serviceOrder.status === 'Enviado'
                          ? 'Enviado ao cliente'
                          : serviceOrder.status
                      }
                      icon={
                        serviceOrder.status === 'Rascunho'
                          ? Pencil
                          : serviceOrder.status === 'Aberto'
                          ? AlertCircle
                          : serviceOrder.status === 'Enviado'
                          ? ArrowRightCircle
                          : serviceOrder.status === 'Faturado'
                          ? CircleDollarSign
                          : CheckCircle2
                      }
                    />
                  </Card.Header>
                  <Card.Content>
                    <Card.Info icon={User} info="Thayná Gitirana" />
                    <Card.Info
                      icon={Clock}
                      info={`${format(
                        new Date(serviceOrder.startDate),
                        'HH:mm',
                      )} - ${format(new Date(serviceOrder.endDate), 'HH:mm')}`}
                    />
                    <Card.Badge
                      className="text-gray-300/80 rounded-md bg-gray-500/20"
                      status={format(new Date(serviceOrder.date), 'dd/LL/yyyy')}
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
