'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import { CircleDollarSign, Clock, PencilLine, Save, Search } from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Client } from '@/types/client'
import CreateOSDetails from './details'
import { ServiceOrder, ServiceOrderDetail } from '@/types/service-order'
import { Card } from '@/components/Card'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import Loading from '@/components/Loading'
import { useUser } from '@/app/contexts/useUser'

interface OsFormProps {
  id?: string
  serviceOrder: ServiceOrder | undefined
}
export default function CreateOSForm({ id }: OsFormProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [clientId, setClientId] = useState<string | null>(null)
  const [osDetails, setOsDetails] = useState<ServiceOrderDetail[]>([])
  const [osDetail, setOsDetail] = useState<ServiceOrderDetail>()
  const [serviceOrder, setServiceOrder] = useState<ServiceOrder>()
  const { auth } = useUser()
  const [status, setStatus] = useState('')
  const [hasError, setHasError] = useState(false)
  const [openDetails, setOpenDetails] = useState(false)

  const serviceTypes: string[] = ['Remoto', 'Presencial']

  const osFormSchema = z.object({
    serviceType: z.string().nonempty('Selecione uma opção'),
    date: z.coerce.date(),
    clientId: z.string().uuid(),
  })

  const router = useRouter()

  type TOsFormData = z.infer<typeof osFormSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TOsFormData>({
    resolver: zodResolver(osFormSchema),
    defaultValues: async () =>
      id &&
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/find/service-order`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            id,
          },
        })
        .then((response) => {
          setServiceOrder(response.data)
          setOsDetails(response.data.serviceOrderDetails)

          setLoading(false)

          return response.data
        })
        .catch(function (error) {
          console.error(error)
        }),
  })

  const handleOSFormSubmit: SubmitHandler<TOsFormData> = (
    data: TOsFormData,
  ) => {
    if (status !== '') {
      handleCreateNewOS(data)
    }
  }

  const handleCreateNewOS = (data: TOsFormData) => {
    setLoading(true)

    if (typeof window !== 'undefined' && auth.token) {
      const serviceOrderDetails = osDetails
      const body = {
        clientId: data.clientId,
        date: data.date,
        serviceType: data.serviceType,
        status,
        serviceOrderDetails,
      }

      if (!id) {
        axios
          .post(`${process.env.NEXT_PUBLIC_API_URL}/service-order`, body, {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          })
          .then(() => {
            setLoading(false)
            router.push('/service-orders')
          })
          .catch((error) => {
            setLoading(false)
            if (error.message === 'Request failed with status code 409') {
              setHasError(true)
            }

            console.log(error)
          })
      }

      if (id) {
        const updateBody = {
          id,
          ...body,
        }

        axios
          .put(
            `${process.env.NEXT_PUBLIC_API_URL}/update/service-order`,
            updateBody,
            {
              headers: {
                Authorization: `Bearer ${auth.token}`,
              },
            },
          )
          .then(() => {
            setLoading(false)
            router.push('/service-orders')
          })
      }
    }
  }

  useEffect(() => {
    if (id) {
      setLoading(true)

      if (serviceOrder) {
        setLoading(false)

        setOsDetails(serviceOrder.serviceOrderDetails)
      }
    }

    if (typeof window !== 'undefined') {
      setLoading(true)
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        })
        .then((response) => {
          setClients(response.data)
          setLoading(false)
        })
    }
  }, [id, serviceOrder, auth.token])

  const handleClientProjects = (selectedKey: any) => {
    const selectedClientId = selectedKey.currentKey
    setClientId(selectedClientId)
    setOpenDetails(true)
  }

  const onOSDetailsSave = (
    newOsDetails: ServiceOrderDetail,
    index?: number,
  ) => {
    if (osDetails) {
      if (index || index === 0) {
        const newOsDetailsList = [...osDetails]

        newOsDetailsList[index] = newOsDetails

        setOsDetails(newOsDetailsList)

        return
      }

      const newOsDetailsList = [...osDetails]
      newOsDetailsList.push(newOsDetails)

      setOsDetails(newOsDetailsList)
    }
  }

  const handleCardDetailClick = (detail: ServiceOrderDetail, index: number) => {
    const newDetail = {
      ...detail,
      index,
    }

    setOsDetail(newDetail)

    if (serviceOrder) {
      setClientId(serviceOrder?.client.id)
    }
  }

  const handleSaveOS = (event: React.MouseEvent<HTMLButtonElement>) => {
    const status = event.currentTarget.id

    setStatus(status)
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col items-center w-full gap-2">
          <form
            onSubmit={handleSubmit(handleOSFormSubmit)}
            className="max-w-7xl w-full space-y-10 px-6 py-14"
          >
            <header className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white">
                Cadastro de Ordem de Serviço
              </span>

              <section className="flex items-center gap-6">
                <Button
                  onClick={() => router.push('/service-orders')}
                  className="rounded-full bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 font-bold"
                >
                  Cancelar
                </Button>

                <Button
                  id="Rascunho"
                  disabled={loading || osDetails.length === 0}
                  type="submit"
                  className="disabled:border-none disabled:bg-transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 text-gray-700 font-bold bg-gray-100 hover:bg-gray-200"
                  onClick={handleSaveOS}
                >
                  <PencilLine size={16} />
                  Salvar Rascunho
                </Button>

                <Button
                  id="Aberto"
                  disabled={loading || osDetails.length === 0}
                  type="submit"
                  className="disabled:border-none disabled:bg-transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 text-gray-700 font-bold bg-yellow-500 hover:bg-yellow-600"
                  onClick={handleSaveOS}
                >
                  <Save size={16} />
                  Salvar OS
                </Button>
              </section>
            </header>

            <section className="flex items-center gap-6">
              <Select
                id="remote"
                label="Atendimento"
                classNames={{
                  trigger:
                    'bg-gray-700 data-[hover=true]:bg-gray-600 rounded-lg',
                  listboxWrapper: 'max-h-[400px] rounded-lg',
                  popover: 'bg-gray-700 rounded-lg',
                }}
                listboxProps={{
                  itemClasses: {
                    base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
                  },
                }}
                {...register('serviceType')}
                errorMessage={errors.serviceType?.message}
                validationState={errors.serviceType && 'invalid'}
                defaultSelectedKeys={
                  id
                    ? [serviceOrder?.remote ? serviceTypes[0] : serviceTypes[1]]
                    : []
                }
              >
                {serviceTypes.map((service) => (
                  <SelectItem key={service}>{service}</SelectItem>
                ))}
              </Select>

              <Input
                id="date"
                type="date"
                label="Emissão"
                placeholder=" "
                classNames={{
                  label: 'text-gray-300 font-normal',
                  inputWrapper:
                    'bg-gray-700 rounded-lg text-gray-100 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 color-scheme:dark',
                  input: '[color-scheme]:dark',
                }}
                {...register('date')}
                errorMessage={errors.date?.message}
                defaultValue={
                  !id ? format(new Date(), 'yyyy-MM-dd') : serviceOrder?.date
                }
                validationState={errors.date && 'invalid'}
              />

              <Select
                id="clientId"
                label="Cliente"
                classNames={{
                  trigger:
                    'bg-gray-700 data-[hover=true]:bg-gray-600 rounded-lg',
                  listboxWrapper: 'max-h-[400px] rounded-lg',
                  popover: 'bg-gray-700 rounded-lg',
                }}
                listboxProps={{
                  itemClasses: {
                    base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
                  },
                }}
                onSelectionChange={(keys) => handleClientProjects(keys)}
                selectorIcon={<Search />}
                {...register('clientId')}
                errorMessage={errors.clientId?.message}
                validationState={errors.clientId && 'invalid'}
                defaultSelectedKeys={id ? [serviceOrder?.clientId || ''] : []}
              >
                {clients.map((client) => {
                  return (
                    <SelectItem key={client.id}>
                      {client.fantasyName}
                    </SelectItem>
                  )
                })}
              </Select>
            </section>
          </form>

          {openDetails && (
            <CreateOSDetails
              clientId={clientId || ''}
              setOpenDetails={setOpenDetails}
              setOsDetail={setOsDetail}
              handleOSDetailsSave={onOSDetailsSave}
              osDetail={osDetail}
              osExpenses={serviceOrder?.serviceOrderExpenses?.filter(
                (expense) => expense.projectId === osDetail?.project?.id,
              )}
              hasError={hasError}
            />
          )}

          {osDetails && (
            <section className="flex flex-wrap gap-6 justify-start w-full max-w-7xl px-6 pb-8">
              {osDetails.map((detail, index) => {
                const endDate =
                  id && detail.endDate.split(':')[0].length !== 2
                    ? format(new Date(detail.endDate), 'HH:mm')
                    : detail?.endDate

                const startDate =
                  id && detail.startDate.split(':')[0].length !== 2
                    ? format(new Date(detail.startDate), 'HH:mm')
                    : detail?.startDate

                return (
                  <Card.Root
                    onClick={() => handleCardDetailClick(detail, index)}
                    className="hover:bg-gray-600 hover:border-2 hover:border-gray-500 min-w-fit max-w-sm"
                    key={index}
                  >
                    <Card.Header>
                      <Card.Title label={detail.project.name} />
                      <Card.Badge
                        className="text-yellow-500 bg-yellow-500/10"
                        status={detail.projectServices.description}
                      />
                    </Card.Header>
                    <Card.Content>
                      <Card.Info
                        icon={Clock}
                        info={startDate + ' - ' + endDate}
                      />
                      {serviceOrder?.serviceOrderExpenses &&
                        serviceOrder?.serviceOrderExpenses?.length > 0 && (
                          <Card.Info
                            icon={CircleDollarSign}
                            info={`${serviceOrder?.serviceOrderExpenses
                              ?.length} ${
                              serviceOrder?.serviceOrderExpenses?.length === 1
                                ? 'despesa'
                                : 'despesas'
                            }`}
                          />
                        )}
                    </Card.Content>
                  </Card.Root>
                )
              })}
            </section>
          )}
        </div>
      )}
    </>
  )
}
