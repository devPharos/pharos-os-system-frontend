'use client'
import { Card } from '@/components/Card'
import axios from 'axios'
import {
  Building2,
  CheckCircle2,
  CircleDashed,
  Eraser,
  PencilLine,
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
import Loading from '@/components/Loading'
import { UserState, useUser } from '@/app/contexts/useUser'

export default function Clients() {
  const router = useRouter()
  const { auth }: { auth: UserState } = useUser()
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])

  const onStatusFilter = ({
    status = null,
    search = '',
  }: {
    status?: Key | null
    search?: string
  }) => {
    const newFilteredClients = clients.map((client) => {
      client.hide = true

      if (status) {
        if (
          (status === 'false' && !client.active) ||
          (status === 'true' && client.active) ||
          status === 'Limpar'
        ) {
          client.hide = false
        }
      }

      if (search) {
        if (client.fantasyName.includes(search)) {
          client.hide = false
        }
      }

      if (!search && !status) {
        client.hide = false
      }

      return client
    })

    setClients(newFilteredClients)
  }

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      })
      .then(function (response) {
        const data = response.data
        setClients(data)
        setLoading(false)
      })
      .catch(function (error) {
        console.error(error)
        setLoading(false)
      })
  }, [auth?.token])

  const handleChangeClientStatus = (
    key: Key,
    id: string,
    active: boolean | undefined,
  ) => {
    if (key === 'status' && typeof window !== 'undefined') {
      const body = {
        clientId: id,
        active: !active,
      }

      axios
        .put(`${process.env.NEXT_PUBLIC_API_URL}/update/client/status`, body, {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        })
        .then(function (response) {
          const data = response.data
          setClients(data)
          setLoading(false)
        })
        .catch(function (error) {
          console.error(error)
          setLoading(false)
        })
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/clients/create?id=${id}`)
  }

  const handleClientCardClick = (
    key: Key,
    id: string,
    active: boolean | undefined,
  ) => {
    if (key === 'edit') {
      handleEdit(id)
    }

    if (key === 'status') {
      handleChangeClientStatus(key, id, active)
    }
  }

  return (
    <>
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

        <header className="flex items-center justify-between gap-6">
          <Input
            placeholder="Buscar"
            startContent={<Search className="w-5 h-5 text-gray-300" />}
            classNames={{
              label: 'font-semibold text-gray-300',
              inputWrapper:
                'bg-transparent border border-1 rounded-lg border-gray-300 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 px-4 py-2',
            }}
            onValueChange={(search) => onStatusFilter({ search })}
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

          <Button
            onClick={() => router.push('/clients/users')}
            className="rounded-full px-6 py-4 hover:text-gray-700 text-yellow-500 font-bold border-dashed border-2 min-w-fit bg-transparent border-yellow-500 hover:bg-yellow-500"
          >
            <PlusCircle size={18} />
            Adicionar usuário
          </Button>
        </header>

        {loading ? (
          <Loading />
        ) : (
          <section className="flex flex-wrap w-full gap-6">
            {clients.map((client) => {
              if (!client.hide) {
                return (
                  <Dropdown
                    classNames={{
                      base: 'bg-gray-700 rounded-lg w-full flex-1',
                    }}
                    backdrop="opaque"
                    key={client.cnpj}
                  >
                    <DropdownTrigger>
                      <Button className="p-0 rounded-none h-fit  w-full  bg-transparent min-w-fit max-w-sm">
                        <Card.Root className="hover:bg-gray-600 hover:border-2 hover:border-gray-500 min-w-fit max-w-sm">
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
                            {!client.userId && (
                              <Card.Badge
                                className="text-gray-300/80 bg-gray-500/10"
                                status={'Sem acesso'}
                              />
                            )}
                          </Card.Content>
                        </Card.Root>
                      </Button>
                    </DropdownTrigger>

                    <DropdownMenu
                      itemClasses={{
                        base: 'rounded-lg data-[hover=true]:bg-gray-800 data-[hover=true]:text-gray-200 data-[selected=true]:text-gray-100 data-[selected=true]:font-bold',
                      }}
                      onAction={(key: Key) =>
                        handleClientCardClick(key, client.id, client?.active)
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
                            pathname: '/clients/create',
                            query: {
                              id: client.id,
                            },
                          }}
                        >
                          Editar cliente
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
                        Alterar status do cliente
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                )
              }

              return null
            })}
          </section>
        )}
      </main>
    </>
  )
}
