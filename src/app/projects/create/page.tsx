'use client'

import Loading from '@/components/Loading'
import Header from '@/layouts/header'
import { Client } from '@/types/client'
import { Company } from '@/types/company'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import axios from 'axios'
import { Clock, Save } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import ProjectExpensesForm from './expenses'

export default function CreateProject() {
  const [companies, setCompanies] = useState<Company[]>([])
  const searchParams = useSearchParams()
  const params = Array.from(searchParams.values())
  const [client, setClient] = useState<Client>()
  const id = params[0]
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const localStorage = window.localStorage
  const token = localStorage.getItem('access_token')

  const clientFormSchema = z.object({
    clientId: z.string().uuid('Selecione uma opção'),
    coordinatorId: z.string().uuid('Selecione uma opção'),
    name: z.string().min(1, 'Insira o nome do projeto'),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    deliveryForecast: z.coerce.date(),
    hoursForecast: z.string().min(1, 'Insira a previsão de horas'),
    hoursBalance: z.string().min(1, 'Insira o balanço de horas'),
    hourValue: z.string().min(1, 'Insira o valor da hora'),
  })

  type ClientFormSchema = z.infer<typeof clientFormSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormSchema>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: async () =>
      id &&
      axios
        .get('http://localhost:3333/client/data', {
          headers: {
            Authorization: `Bearer ${token}`,
            id,
          },
        })
        .then((response) => {
          setClient(response.data)
          return response.data
        })
        .catch(function (error) {
          console.error(error)
        }),
  })

  const handleClientFormSubmit: SubmitHandler<ClientFormSchema> = (
    data: ClientFormSchema,
  ) => {
    setLoading(true)

    if (window !== undefined) {
      const localStorage = window.localStorage
      const token = localStorage.getItem('access_token')

      axios
        .post('http://localhost:3333/accounts/client', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(function () {
          setLoading(false)
          router.push('/clients')
        })
        .catch(function (error) {
          console.error(error)
        })
    }
  }

  useEffect(() => {
    setLoading(true)
    if (window !== undefined) {
      const localStorage = window.localStorage
      const token = localStorage.getItem('access_token')

      axios
        .get('http://localhost:3333/companies', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(function (response) {
          const data = response.data
          setCompanies(data)
          setLoading(false)
        })
        .catch(function (error) {
          console.error(error)
        })
    }
  }, [id])

  return (
    <div className="min-h-screen flex flex-col items-center gap-14">
      <Header />

      <div className="flex flex-col items-center w-full gap-6 pb-6">
        <form
          onSubmit={handleSubmit(handleClientFormSubmit)}
          className="max-w-7xl w-full space-y-10 px-6"
        >
          <header className={'flex items-center justify-between'}>
            <span className="text-2xl font-bold text-white">
              Cadastro de Projeto
            </span>

            <section className="flex items-center gap-6">
              <Button
                disabled={loading}
                type="submit"
                className="disabled:border-none items-center disabled:transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 text-gray-700 bg-yellow-500 font-bold hover:bg-yellow-600"
              >
                <Save size={16} />
                Salvar projeto
              </Button>
            </section>
          </header>

          <section className="flex flex-wrap  gap-6">
            <Select
              id="clientId"
              label="Cliente"
              classNames={{
                trigger:
                  'bg-gray-700 max-w-sm data-[hover=true]:bg-gray-600 rounded-lg',
                listboxWrapper: 'max-w-sm rounded-lg',
                popover: 'bg-gray-700 max-w-sm rounded-lg ',
                base: 'max-w-sm',
                mainWrapper: 'max-w-sm',
                innerWrapper: 'max-w-sm',
              }}
              listboxProps={{
                itemClasses: {
                  base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
                },
              }}
              {...register('clientId')}
              errorMessage={errors.clientId?.message}
              validationState={errors.clientId && 'invalid'}
              defaultSelectedKeys={client ? [client?.companyId] : []}
            >
              {companies.map((company) => (
                <SelectItem key={company.id}>{company.name}</SelectItem>
              ))}
            </Select>

            <Select
              id="coordinatorId"
              label="Coordenador"
              classNames={{
                trigger:
                  'bg-gray-700 max-w-sm data-[hover=true]:bg-gray-600 rounded-lg',
                listboxWrapper: 'max-w-sm rounded-lg',
                popover: 'bg-gray-700 max-w-sm rounded-lg ',
                base: 'max-w-sm',
                mainWrapper: 'max-w-sm',
                innerWrapper: 'max-w-sm',
              }}
              listboxProps={{
                itemClasses: {
                  base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
                },
              }}
              {...register('coordinatorId')}
              errorMessage={errors.coordinatorId?.message}
              validationState={errors.coordinatorId && 'invalid'}
              defaultSelectedKeys={client ? [client?.companyId] : []}
            >
              {companies.map((company) => (
                <SelectItem key={company.id}>{company.name}</SelectItem>
              ))}
            </Select>

            <Input
              id="name"
              label="Nome do projeto"
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('name')}
              errorMessage={errors.name?.message}
              validationState={errors.name && 'invalid'}
              placeholder={id && ' '}
            />

            <Input
              id="startDate"
              type="date"
              label="Data de início"
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('startDate')}
              errorMessage={errors.startDate?.message}
              validationState={errors.startDate && 'invalid'}
              placeholder={' '}
            />

            <Input
              id="endDate"
              type="date"
              label="Data de término"
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm min-w-fit',
                mainWrapper: ' max-w-sm min-w-fit',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('startDate')}
              errorMessage={errors.startDate?.message}
              validationState={errors.startDate && 'invalid'}
              placeholder={' '}
            />

            <Input
              id="deliveryForecast"
              type="date"
              label="Previsão de entrega"
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm min-w-fit',
                mainWrapper: ' max-w-sm min-w-fit',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('deliveryForecast')}
              errorMessage={errors.deliveryForecast?.message}
              validationState={errors.deliveryForecast && 'invalid'}
              placeholder={' '}
            />

            <Input
              id="hoursForecast"
              label="Previsão de horas"
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm min-w-fit',
                mainWrapper: ' max-w-sm min-w-fit',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('hoursForecast')}
              errorMessage={errors.hoursForecast?.message}
              validationState={errors.hoursForecast && 'invalid'}
            />

            <Input
              id="hoursBalance"
              label="Balanço de horas"
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm min-w-fit',
                mainWrapper: ' max-w-sm min-w-fit',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('hoursBalance')}
              errorMessage={errors.hoursBalance?.message}
              validationState={errors.hoursBalance && 'invalid'}
            />

            <Input
              id="hourValue"
              label="Valor da hora"
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm min-w-fit',
                mainWrapper: ' max-w-sm min-w-fit',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('hourValue')}
              errorMessage={errors.hourValue?.message}
              validationState={errors.hourValue && 'invalid'}
            />
          </section>
        </form>

        <ProjectExpensesForm />
      </div>
    </div>
  )
}
