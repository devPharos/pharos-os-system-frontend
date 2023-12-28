'use client'
import { Card } from '@/components/Card'
import { saveAs } from 'file-saver'

import Header from '@/layouts/header'
import PageHeader from '@/layouts/page-header'
import {
  ServiceOrderCard,
  ServiceOrderDate,
  ServiceOrderPage,
} from '@/types/service-order'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  useDisclosure,
} from '@nextui-org/react'
import axios from 'axios'
import { format } from 'date-fns'
import {
  AlertCircle,
  ArrowRightCircle,
  CheckCircle2,
  CircleDashed,
  CircleDollarSign,
  Clock,
  Eraser,
  Filter,
  Pencil,
  PencilLine,
  PlusCircle,
  Search,
  Trash,
  User,
  XCircle,
} from 'lucide-react'
import {
  ChangeEvent,
  ChangeEventHandler,
  Key,
  useEffect,
  useState,
} from 'react'
import Loading from '@/components/Loading'
import { useRouter } from 'next/navigation'
import { getUserData } from '@/hooks/useRegister'
import { UserData } from '@/types/user'

export default function ServiceOrders() {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrderCard[]>([])
  const [serviceOrderData, setServiceOrderData] = useState<ServiceOrderPage>()
  const [dates, setDates] = useState<ServiceOrderDate[]>([])
  const [loading, setLoading] = useState(false)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selectedOs, setSelectedOs] = useState('')
  const [user, setUser] = useState<UserData>()
  const [items, setItems] = useState<
    {
      key: string
      label: string
    }[]
  >([])
  const router = useRouter()

  const onStatusFilter = ({
    status = null,
    search = '',
    supervisor = null,
  }: {
    status?: Key | null
    supervisor?: Key | null
    search?: string
  }) => {
    const newFilteredServiceOrders = serviceOrders.map((serviceOrder) => {
      serviceOrder.hide = true

      if (status) {
        if (serviceOrder.status === status || status === 'Limpar') {
          serviceOrder.hide = false
        }
      }

      if (search) {
        if (serviceOrder.client.fantasyName.includes(search)) {
          serviceOrder.hide = false
        }
      }

      if (supervisor) {
        if (serviceOrder.collaborator.id === supervisor) {
          serviceOrder.hide = false
        }

        if (supervisor === 'all') {
          serviceOrder.hide = false
        }

        if (supervisor === 'me') {
          if (serviceOrder.collaborator.id === user?.collaboratorId) {
            serviceOrder.hide = false
          }
        }
      }

      if (!search && !status && !supervisor) {
        serviceOrder.hide = false
      }

      return serviceOrder
    })

    setServiceOrders(newFilteredServiceOrders)
  }

  const handleAction = (key: Key, id: string) => {
    if (key === 'edit') {
      router.push(`/service-orders/create?id=${id}`)
    }

    if (key === 'delete') {
      if (window !== undefined) {
        const localStorage = window.localStorage
        const userToken: string = localStorage.getItem('access_token') || ''

        axios
          .delete('http://localhost:3333/delete/service-order', {
            headers: {
              Authorization: `Bearer ${userToken}`,
              id,
            },
          })
          .then(() => {
            window.location.reload()
          })
      }
    }

    if (key === 'confirm') {
      handleChangeOsStatus(id, 'Aberto')
    }

    if (key === 'validate') {
      handleChangeOsStatus(id, 'Validado')
    }

    if (key === 'remove-validation') {
      handleChangeOsStatus(id, 'Aberto')
    }

    if (key === 'change-status') {
      handleOpenModal(id)
    }
  }

  const handleChangeOsStatus = (
    id: string,
    status: 'Aberto' | 'Enviado' | 'Faturado' | 'Validado' | 'Rascunho',
  ) => {
    if (window !== undefined) {
      const localStorage = window.localStorage
      const userToken: string = localStorage.getItem('access_token') || ''
      const body = {
        id,
        status,
      }

      axios
        .put('http://localhost:3333/update/service-order/status', body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then(() => {
          window.location.reload()
        })
    }
  }

  const handleOpenModal = (id: string) => {
    onOpen()
    setSelectedOs(id)
  }

  const handleUserData = async () => {
    const user = await getUserData()
    setUser(user)
  }

  useEffect(() => {
    handleUserData()

    if (window !== undefined) {
      const localStorage = window.localStorage
      const userToken: string = localStorage.getItem('access_token') || ''

      axios
        .get('http://localhost:3333/list/service-orders', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((response) => {
          setServiceOrderData(response.data)
          const os = [
            ...response.data.serviceOrders,
            ...response.data.serviceOrdersSupervisedByMe,
          ]
          const allOs: ServiceOrderCard[] = os
          allOs.forEach((os) => {
            os.selected = false
          })

          os.sort((a, b) => {
            const dataA = new Date(a.date).getTime()
            const dataB = new Date(b.date).getTime()

            return dataA - dataB
          })

          setServiceOrders(os)
        })

      axios
        .get('http://localhost:3333/list/service-orders/filters', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((response) => {
          setDates(response.data)
        })
    }
  }, [])

  useEffect(() => {
    const items: {
      key: string
      label: string
    }[] = [
      {
        key: 'all',
        label: 'Todos',
      },
      {
        key: 'me',
        label: 'Minhas',
      },
    ]

    serviceOrders.forEach((os) => {
      if (os.collaborator.supervisorId === user?.collaboratorId) {
        if (!items.find((item) => item.key === os.collaborator.id)) {
          items.push({
            key: os.collaborator.id,
            label: os.collaborator.name,
          })
        }
      }
    })

    setItems(items)
  }, [serviceOrders, user?.collaboratorId])

  const getServiceOrdersByMonth: ChangeEventHandler<HTMLSelectElement> = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedValue = event.target.value
    const localStorage = window.localStorage
    const userToken: string = localStorage.getItem('access_token') || ''

    axios
      .get('http://localhost:3333/list/service-orders', {
        headers: {
          Authorization: `Bearer ${userToken}`,
          filterDate: selectedValue,
        },
      })
      .then((response) => {
        const os = [
          ...response.data.serviceOrders,
          ...response.data.serviceOrdersSupervisedByMe,
        ]
        const allOs: ServiceOrderCard[] = os
        allOs.forEach((os) => {
          os.selected = false
        })

        os.sort((a, b) => {
          const dataA = new Date(a.date).getTime()
          const dataB = new Date(b.date).getTime()

          return dataA - dataB
        })

        setServiceOrders(os)
      })
  }

  async function MakeReporting() {
    setLoading(true)

    if (window !== undefined) {
      const localStorage = window.localStorage
      const userToken: string = localStorage.getItem('access_token') || ''

      const response2 = await axios.get('http://localhost:3333/pdf', {
        headers: {
          Authorization: `Bearer ${userToken}`,
          id: 'eede43f5-f635-4d1b-a4f8-3dba1cda4111',
        },
        responseType: 'blob',
      })

      const pdfBlob = new Blob([response2.data], { type: 'application/pdf' })
      saveAs(pdfBlob)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <main className="max-w-7xl w-full  flex flex-col px-6 py-14 gap-16 flex-1">
        <PageHeader
          title="Ordens de serviço"
          subtitle="Gerencie todas suas ordens de serviço"
          label="Adicionar OS"
        />

        {loading ? (
          <Loading />
        ) : (
          <>
            <Select
              id="remote"
              label="Período"
              classNames={{
                trigger:
                  'bg-gray-700 max-w-[250px] data-[hover=true]:bg-gray-600 rounded-lg',
                listboxWrapper: 'max-h-[400px] rounded-lg',
                popover: 'bg-gray-700 rounded-lg',
              }}
              listboxProps={{
                itemClasses: {
                  base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
                },
              }}
              onChange={getServiceOrdersByMonth}
              defaultSelectedKeys={[
                dates.find((date) => date.date === serviceOrderData?.date)
                  ?.date || '',
              ]}
            >
              {dates &&
                dates.map((date) => (
                  <SelectItem key={date.date} value={date.date}>
                    {date.formattedDate}
                  </SelectItem>
                ))}
            </Select>

            <header className="flex items-center justify-between">
              <section className="flex w-full gap-6">
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
                    base: 'bg-gray-700 rounded-lg',
                  }}
                  backdrop="opaque"
                >
                  <DropdownTrigger>
                    <Button
                      className="rounded-lg min-w-fit border-2 border-dashed bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:border-solid hover:font-bold"
                      startContent={<PlusCircle size={18} />}
                    >
                      Supervisor
                    </Button>
                  </DropdownTrigger>

                  <DropdownMenu
                    onAction={(key) => onStatusFilter({ supervisor: key })}
                    itemClasses={{
                      base: 'rounded-lg data-[hover=true]:bg-gray-800 data-[hover=true]:text-gray-200 data-[selected=true]:text-gray-100 data-[selected=true]:font-bold',
                    }}
                    items={items}
                  >
                    {(item: any) => (
                      <DropdownItem
                        key={item.key}
                        startContent={
                          <Card.Badge
                            status=""
                            className="text-gray-300/80 bg-gray-500/10 py-2 px-2 rounded-md"
                            icon={Filter}
                          />
                        }
                      >
                        {item.label}
                      </DropdownItem>
                    )}
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
                      Status
                    </Button>
                  </DropdownTrigger>

                  <DropdownMenu
                    onAction={(key) => onStatusFilter({ status: key })}
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

                <Button
                  className="rounded-lg min-w-fit px-6 py-4 text-gray-200 font-bold bg-zinc-800 hover:bg-zinc-700"
                  onClick={MakeReporting}
                  disabled={loading}
                >
                  {loading && <Spinner size="sm" color="default" />}
                  Baixar relatório
                </Button>
              </section>
            </header>
            <section className="flex flex-wrap w-full gap-6">
              {serviceOrders?.map((serviceOrder) => {
                if (!serviceOrder.hide) {
                  return (
                    <>
                      <Dropdown
                        classNames={{
                          base: 'bg-gray-700 rounded-lg w-full flex-1',
                        }}
                        backdrop="opaque"
                        key={serviceOrder.id}
                        isDisabled={
                          serviceOrder.collaborator?.supervisorId !==
                            user?.collaboratorId &&
                          serviceOrder.status !== 'Aberto' &&
                          serviceOrder.status !== 'Rascunho'
                        }
                      >
                        <DropdownTrigger>
                          <Button className="p-0 rounded-none h-fit  w-full  bg-transparent min-w-fit max-w-sm">
                            <Card.Root className="hover:bg-gray-600 hover:border-2 hover:border-gray-500 min-w-fit">
                              <Card.Header>
                                <section className="flex items-center gap-2">
                                  <Card.Title
                                    label={serviceOrder?.client?.fantasyName}
                                  />
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
                                <Card.Info
                                  icon={User}
                                  info={serviceOrder.collaborator.name}
                                />
                                <Card.Info
                                  icon={Clock}
                                  info={`${format(
                                    new Date(serviceOrder.startDate),
                                    'HH:mm',
                                  )} - ${format(
                                    new Date(serviceOrder.endDate),
                                    'HH:mm',
                                  )}`}
                                />
                                <Card.Badge
                                  className="text-gray-300/80 rounded-md bg-gray-500/20"
                                  status={format(
                                    new Date(serviceOrder.date),
                                    'dd/LL/yyyy',
                                  )}
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
                            handleAction(key, serviceOrder.id)
                          }
                        >
                          <DropdownSection
                            className={
                              serviceOrder.collaborator?.supervisorId ===
                              user?.collaboratorId
                                ? ''
                                : 'hidden'
                            }
                          >
                            <DropdownItem
                              startContent={
                                <Card.Badge
                                  status=""
                                  className="text-gray-300/80 bg-gray-500/10  py-2 px-2 rounded-md"
                                  icon={
                                    serviceOrder.status === 'Validado'
                                      ? XCircle
                                      : CheckCircle2
                                  }
                                />
                              }
                              key={
                                serviceOrder.status === 'Validado'
                                  ? 'remove-validation'
                                  : 'validate'
                              }
                            >
                              {serviceOrder.status === 'Validado'
                                ? 'Estonar OS'
                                : 'Validar OS'}
                            </DropdownItem>

                            <DropdownItem
                              startContent={
                                <Card.Badge
                                  status=""
                                  className="text-gray-300/80 bg-gray-500/10  py-2 px-2 rounded-md"
                                  icon={CircleDashed}
                                />
                              }
                              key={'change-status'}
                            >
                              Alterar status da ordem de serviço
                            </DropdownItem>
                          </DropdownSection>

                          <DropdownSection
                            className={
                              serviceOrder.collaborator?.supervisorId !==
                                user?.collaboratorId &&
                              serviceOrder.status === 'Aberto'
                                ? ''
                                : 'hidden'
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
                              Editar ordem de serviço
                            </DropdownItem>

                            <DropdownItem
                              startContent={
                                <Card.Badge
                                  status=""
                                  className="text-gray-300/80 bg-gray-500/10  py-2 px-2 rounded-md"
                                  icon={Trash}
                                />
                              }
                              key={'delete'}
                            >
                              Excluir ordem de serviço
                            </DropdownItem>
                          </DropdownSection>

                          <DropdownSection
                            className={
                              serviceOrder.collaborator?.supervisorId !==
                                user?.collaboratorId &&
                              serviceOrder.status === 'Rascunho'
                                ? ''
                                : 'hidden'
                            }
                          >
                            <DropdownItem
                              startContent={
                                <Card.Badge
                                  status=""
                                  className="text-gray-300/80 bg-gray-500/10  py-2 px-2 rounded-md"
                                  icon={CheckCircle2}
                                />
                              }
                              key={'confirm'}
                            >
                              Confirmar OS
                            </DropdownItem>
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
                              Editar ordem de serviço
                            </DropdownItem>

                            <DropdownItem
                              startContent={
                                <Card.Badge
                                  status=""
                                  className="text-gray-300/80 bg-gray-500/10  py-2 px-2 rounded-md"
                                  icon={Trash}
                                />
                              }
                              key={'delete'}
                            >
                              Excluir ordem de serviço
                            </DropdownItem>
                          </DropdownSection>
                        </DropdownMenu>
                      </Dropdown>

                      <Modal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        backdrop="opaque"
                        classNames={{
                          base: 'bg-gray-700 rounded-lg',
                        }}
                      >
                        <ModalContent>
                          {(onClose) => (
                            <>
                              <ModalHeader className="flex flex-col gap-1">
                                Alterar status da ordem de serviço
                              </ModalHeader>
                              <ModalBody>
                                <Button
                                  className="bg-transparent hover:bg-gray-800 text-gray-100 justify-start"
                                  startContent={
                                    <Card.Badge
                                      status=""
                                      className="bg-orange-600/10 text-orange-600 py-2 px-2 rounded-md"
                                      icon={ArrowRightCircle}
                                    />
                                  }
                                  onClick={() =>
                                    handleChangeOsStatus(selectedOs, 'Enviado')
                                  }
                                >
                                  Enviado ao cliente
                                </Button>

                                <Button
                                  className="bg-transparent hover:bg-gray-800 text-gray-100 justify-start"
                                  startContent={
                                    <Card.Badge
                                      status=""
                                      className="bg-green-500/10 text-green-500 py-2 px-2 rounded-md"
                                      icon={CircleDollarSign}
                                    />
                                  }
                                  onClick={() =>
                                    handleChangeOsStatus(selectedOs, 'Faturado')
                                  }
                                >
                                  Faturado
                                </Button>
                              </ModalBody>
                            </>
                          )}
                        </ModalContent>
                      </Modal>
                    </>
                  )
                } else {
                  return null
                }
              })}
            </section>
          </>
        )}
      </main>
    </div>
  )
}
