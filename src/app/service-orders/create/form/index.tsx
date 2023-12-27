'use client'

import { getUserData, useRegister } from '@/hooks/useRegister'
import DatePicker from 'react-datepicker'
import Header from '@/layouts/header'
import { UserData } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import {
  AlertCircle,
  Calendar,
  CircleDollarSign,
  ClipboardCheck,
  Clock,
  DollarSign,
  FileUp,
  PlusCircle,
  Save,
  Search,
  User,
} from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Key, useEffect, useState } from 'react'
import axios from 'axios'
import { Client } from '@/types/client'
import CreateOSDetails from './details'
import {
  ServiceOrder,
  ServiceOrderCreation,
  ServiceOrderDetail,
  ServiceOrderDetails,
} from '@/types/service-order'
import { Card } from '@/components/Card'
import { useRouter } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import Loading from '@/components/Loading'

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
  const token = localStorage.getItem('access_token')
  const [date, setDate] = useState('')

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
        .get('http://localhost:3333/find/service-order', {
          headers: {
            Authorization: `Bearer ${token}`,
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
    if (window !== undefined) {
      const localStorage = window.localStorage
      const userToken: string = localStorage.getItem('access_token') || ''
      // let totalHours = 0

      osDetails.forEach((detail) => {
        // totalHours += detail.projectDetails.totalHours
      })

      osDetails.sort(
        (a: any, b: any) =>
          a.projectDetails.startDate - b.projectDetails.startDate,
      )

      // const startDate: Date = osDetails[0].projectDetails.startDate
      // const endDate: Date =
      //   osDetails[osDetails.length - 1].projectDetails.endDate

      // axios
      //   .get(`http://localhost:3333/accounts/user`, {
      //     headers: {
      //       Authorization: `Bearer ${userToken}`,
      //     },
      //   })
      //   .then((response) => {
      //     const userData = response.data
      //     // const body: ServiceOrderCreation = {
      //     //   clientId: data.clientId,
      //     //   collaboratorId: userData?.collaboratorId || '',
      //     //   companyId: userData?.companyId,
      //     //   date: data.date,
      //     //   remote: data.serviceType === 'Remoto',
      //     //   startDate,
      //     //   endDate,
      //     //   totalHours: totalHours.toString(),
      //     //   //serviceOrderDetails: osDetails,
      //     // }
      //     axios
      //       .post('http://localhost:3333/service-order', body, {
      //         headers: {
      //           Authorization: `Bearer ${userToken}`,
      //         },
      //       })
      //       .then(() => {
      //         // setLoading(true)
      //         router.push('/service-orders')
      //       })
      //       .catch((error) => {
      //         console.log(error)
      //       })
      //   })
    }
  }

  useEffect(() => {
    if (id) {
      setLoading(true)
      // setLoading(false)

      if (serviceOrder) {
        setLoading(false)

        const newDate = format(new Date(serviceOrder.date), 'yyyy-LL-dd')
        setDate(newDate)

        setOsDetails(serviceOrder.serviceOrderDetails)
      }
    }

    if (window !== undefined) {
      setLoading(true)
      const localStorage = window.localStorage
      const userToken: string = localStorage.getItem('access_token') || ''

      axios
        .get('http://localhost:3333/clients', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((response) => {
          setClients(response.data)
          setLoading(false)
        })
    }
  }, [id, serviceOrder])

  const handleClientProjects = (selectedKey: any) => {
    const selectedClientId = selectedKey.currentKey
    setClientId(selectedClientId)
  }

  const onOSDetailsSave = (newOsDetails: ServiceOrderDetail) => {
    const newOsDetailsList = [...osDetails]

    newOsDetailsList.push(newOsDetails)
    setOsDetails(newOsDetailsList)
  }

  const handleCardDetailClick = (detail: ServiceOrderDetail) => {
    setOsDetail(detail)

    if (serviceOrder) {
      setClientId(serviceOrder?.client.id)
    }
  }

  console.log(osDetails)

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
                  disabled={loading || osDetails.length === 0}
                  type="submit"
                  className="disabled:border-none disabled:bg-transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 text-gray-700 font-bold bg-yellow-500 hover:bg-yellow-600"
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

          {clientId && (
            <CreateOSDetails
              clientId={clientId || ''}
              handleOSDetailsSave={onOSDetailsSave}
              osDetail={osDetail}
              osExpenses={serviceOrder?.serviceOrderExpenses?.filter(
                (expense) => expense.projectId === osDetail?.project?.id,
              )}
            />
          )}

          {osDetails && (
            <section className="flex flex-wrap gap-6 justify-start w-full max-w-7xl px-6 pb-8">
              {osDetails.map((detail, index) => {
                return (
                  <Card.Root
                    onClick={() => handleCardDetailClick(detail)}
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
                        info={`${format(
                          new Date(detail.startDate),
                          'HH:mm',
                        )} - ${format(new Date(detail.endDate), 'HH:mm')}`}
                      />
                      {detail.project.projectsExpenses?.length > 0 && (
                        <Card.Info
                          icon={CircleDollarSign}
                          info={`${detail.project.projectsExpenses?.length} ${
                            detail.project.projectsExpenses?.length === 1
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
