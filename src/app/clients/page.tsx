'use client'
import ClientTable from '@/components/tables/client'
import { useRegister } from '@/hooks/useRegister'
import Header from '@/layouts/header'
import PageHeader from '@/layouts/page-header'
import { Card } from '@/components/Card'
import axios from 'axios'
import {
  AlertCircle,
  ArrowRightCircle,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Eraser,
  Eye,
  Monitor,
  Pencil,
  PlusCircle,
  Search,
  XCircle,
} from 'lucide-react'
import { Key, useEffect, useState } from 'react'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Input,
} from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { Client } from '@/types/client'
import Link from 'next/link'

export default function Clients() {
  const token = localStorage.getItem('access_token')
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [filteredItems, setFilteredItems] = useState<Client[]>([])

  const onStatusFilter = (status: Key) => {
    const newClientsList = [...clients]
    const active = status !== 'false'

    if (status !== 'Limpar') {
      const filteredList = newClientsList.filter(
        (client) => client.active === active,
      )
      setFilteredItems(filteredList)
    }

    if (status === 'Limpar') {
      setFilteredItems(newClientsList)
    }
  }

  useEffect(() => {
    axios
      .get('http://localhost:3333/clients', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        const data = response.data
        setClients(data)
        setFilteredItems(response.data)
      })
      .catch(function (error) {
        console.error(error)
      })
  }, [token])

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <main className="max-w-7xl w-full  flex flex-col px-6 py-14 gap-16 flex-1">
        <header className="flex items-center justify-between">
          <section className="flex flex-col">
            <span className="font-bold text-2xl text-white">Clientes</span>
            <span className="text-gray-300">Gerencie todos os clientes</span>
          </section>

          <Button
            className="rounded-full px-6 py-4 text-gray-700 font-bold bg-yellow-500 hover:bg-yellow-600"
            onClick={() => router.push('/clients/create')}
          >
            <PlusCircle size={18} className="text-gray-700" />
            Adicionar cliente
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
          </section>
        </header>

        <section className="flex flex-wrap w-full gap-6">
          {filteredItems.map((client) => {
            return (
              <Link
                href={{
                  pathname: '/clients/create',
                  query: {
                    id: client.id,
                  },
                }}
                key={client.id}
                className="flex-1"
              >
                <Card.Root className="hover:bg-gray-600 hover:border-2 hover:border-gray-500 items-stretch min-w-fit max-w-sm">
                  <Card.Header>
                    <Card.Title label={client.fantasyName} />
                    <Card.Badge
                      className={
                        client.active
                          ? 'text-green-500 bg-green-500/10'
                          : 'text-red-500 bg-red-500/10'
                      }
                      status={client.active ? 'Ativo' : 'Inativo'}
                    />
                  </Card.Header>
                  <Card.Content>
                    <Card.Info icon={Building2} info={client.cnpj} />
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
