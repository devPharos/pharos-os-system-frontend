'use client'
import { Card } from '@/components/Card'
import ServiceOrdersTable from '@/components/tables/service-orders'
import Header from '@/layouts/header'
import PageHeader from '@/layouts/page-header'
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
  Building2,
  Calendar,
  CircleDashed,
  CircleDollarSign,
  Clock,
  Eraser,
  Eye,
  Pencil,
  PersonStanding,
  PlusCircle,
  Search,
  User,
  Users2,
  XCircle,
} from 'lucide-react'
import { Key, useEffect, useState } from 'react'

export default function ServiceOrders() {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrderCard[]>([])
  const [filteredItems, setFilteredItems] = useState<ServiceOrderCard[]>([])

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
          setServiceOrders(response.data)
          setFilteredItems(response.data)
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
                        className="bg-red-500/10 text-red-500 py-2 px-2 rounded-md"
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
                        className="bg-green-500/10 text-green-500 py-2 px-2 rounded-md"
                        icon={CircleDollarSign}
                      />
                    }
                    key={'Faturado'}
                  >
                    Faturado
                  </DropdownItem>

                  <DropdownItem
                    startContent={
                      <Card.Badge
                        status=""
                        className="bg-gray-500/10 text-gray-300 py-2 px-2 rounded-md"
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
          </section>

          <section className="space-x-6">
            <Button className="rounded-full border-2 border-dashed bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:border-solid hover:font-bold">
              <Pencil size={16} />
              Alterar
            </Button>

            <Button className="rounded-full border-2 border-dashed bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:border-solid hover:font-bold">
              <Eye size={16} />
              Visualizar
            </Button>
          </section>
        </header>

        <section className="flex flex-wrap gap-6">
          {filteredItems.map((serviceOrder) => {
            return (
              <Card.Root
                className="hover:bg-gray-600 hover:border-2 hover:border-gray-500 min-w-fit max-w-sm"
                key={serviceOrder.id}
              >
                <Card.Header>
                  <section className="flex items-center gap-2">
                    <Card.Badge
                      className="text-gray-300/80  rounded-md bg-gray-500/20"
                      status={format(new Date(serviceOrder.date), 'dd/LL/yyyy')}
                    />
                    <Card.Title label="Pharos IT Solutions" />
                  </section>
                  <Card.Badge
                    className={
                      serviceOrder.status === 'Aberto'
                        ? 'bg-red-500/10 text-red-500'
                        : serviceOrder.status === 'Enviado'
                        ? 'bg-orange-600/10 text-orange-600'
                        : serviceOrder.status === 'Cancelado'
                        ? 'text-gray-300/80 bg-gray-500/10'
                        : 'text-green-500/80 bg-green-500/10'
                    }
                    status={
                      serviceOrder.status === 'Aberto'
                        ? 'Em aberto'
                        : serviceOrder.status === 'Enviado'
                        ? 'Enviado ao cliente'
                        : serviceOrder.status
                    }
                    icon={
                      serviceOrder.status === 'Aberto'
                        ? AlertCircle
                        : serviceOrder.status === 'Enviado'
                        ? ArrowRightCircle
                        : serviceOrder.status === 'Cancelado'
                        ? XCircle
                        : CircleDollarSign
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
                </Card.Content>
              </Card.Root>
            )
          })}
        </section>
      </main>
    </div>
  )
}
