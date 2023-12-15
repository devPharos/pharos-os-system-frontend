'use client'

import Loading from '@/components/Loading'
import Header from '@/layouts/header'
import { Client } from '@/types/client'
import { Company } from '@/types/company'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select, SelectItem, Spinner } from '@nextui-org/react'
import axios from 'axios'
import { Clock, Plus, PlusCircle, Save, Trash2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import ProjectExpensesForm from './expenses'
import ProjectServicesForm from './services'
import { Card } from '@/components/Card'
import {
  Project,
  ProjectExpenses,
  ProjectFounded,
  ProjectServices,
} from '@/types/projects'
import { Collaborator } from '@/types/collaborator'
import Toast from '@/components/Toast'
import { getUserData } from '@/hooks/useRegister'
import { UserData } from '@/types/user'
import { format } from 'date-fns'

export default function CreateProject() {
  const [showToast, setShowToast] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [expenses, setExpenses] = useState<Partial<ProjectExpenses>[]>([])
  const [services, setServices] = useState<Partial<ProjectServices>[]>([])
  const [showExpenses, setShowExpenses] = useState(false)
  const [showServices, setShowServices] = useState(false)
  const searchParams = useSearchParams()
  const params = Array.from(searchParams.values())
  const id = params[0]
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const [user, setUser] = useState<UserData>()
  const [project, setProject] = useState<Project>()
  const localStorage = window.localStorage
  const token = localStorage.getItem('access_token')

  const projectFormSchema = z.object({
    clientId: z.string().uuid('Selecione uma opção'),
    coordinatorId: z.string().uuid('Selecione uma opção'),
    name: z.string().min(1, 'Insira o nome do projeto'),
    startDate: z.coerce.date(),
    endDate: z.optional(z.string()),
    deliveryForecast: z.coerce.date(),
    hoursForecast: z.string().min(1, 'Insira a previsão de horas'),
    hoursBalance: z.string(),
    hourValue: z.string().min(1, 'Insira o valor da hora'),
  })

  type ProjectFormSchema = z.infer<typeof projectFormSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormSchema>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: async () =>
      id &&
      axios
        .get('http://localhost:3333/find/project', {
          headers: {
            Authorization: `Bearer ${token}`,
            id,
          },
        })
        .then((response) => {
          setProject(response.data)
          setExpenses(response.data.projectsExpenses)
          setServices(response.data.projectsServices)

          setLoading(false)

          return response.data
        })
        .catch(function (error) {
          console.error(error)
        }),
  })

  const handleProjectFormSubmit: SubmitHandler<ProjectFormSchema> = (
    data: ProjectFormSchema,
  ) => {
    setLoading(true)

    if (window !== undefined) {
      const localStorage = window.localStorage
      const token = localStorage.getItem('access_token')
      const body: Project = {
        ...data,
        projectExpenses: expenses,
        projectServices: services,
        endDate: data.endDate ? new Date(data?.endDate) : undefined,
      }
      if (!id) {
        axios
          .post('http://localhost:3333/projects', body, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(function () {
            setShowToast(true)

            setInterval(() => {
              setShowToast(false)
            }, 3000)
            setLoading(false)

            router.push('/projects')
          })
          .catch(function (error) {
            console.error(error)
          })
      }

      if (id) {
        axios
          .put(
            'http://localhost:3333/update/project',
            {
              ...body,
              projectId: id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(function () {
            setShowToast(true)

            setInterval(() => {
              setShowToast(false)
            }, 3000)
            setLoading(false)

            router.push('/projects')
          })
          .catch(function (error) {
            console.error(error)
          })
      }
    }
  }

  const handleUserData = async () => {
    const user = await getUserData()
    setUser(user)
  }

  useEffect(() => {
    setLoading(true)
    handleUserData()

    if (window !== undefined) {
      const localStorage = window.localStorage
      const token = localStorage.getItem('access_token')

      axios
        .get('http://localhost:3333/clients', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(function (response) {
          const data = response.data
          setClients(data)
          setLoading(false)
        })
        .catch(function (error) {
          console.error(error)
        })

      axios
        .get('http://localhost:3333/collaborators/data', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(function (response) {
          const data = response.data
          setCollaborators(data)
          setLoading(false)
        })
        .catch(function (error) {
          console.error(error)
        })
    }
  }, [id])

  console.log(project?.endDate)

  const onNewProjectExpense = (expense: Partial<ProjectExpenses>) => {
    const newProjectExpenseList: Partial<ProjectExpenses>[] = [...expenses]
    newProjectExpenseList.push(expense)

    setExpenses(newProjectExpenseList)
  }

  const onNewProjectService = (service: Partial<ProjectServices>) => {
    const newProjectServiceList: Partial<ProjectServices>[] = [...services]
    newProjectServiceList.push(service)

    setServices(newProjectServiceList)
  }

  return (
    <div className="min-h-screen flex flex-col items-center gap-14">
      <Header />

      <div className="flex flex-col items-center w-full gap-6 pb-6">
        <form
          onSubmit={handleSubmit(handleProjectFormSubmit)}
          className="max-w-7xl w-full space-y-10 px-6"
        >
          <header className={'flex items-center justify-between'}>
            <span className="text-2xl font-bold text-white">
              Cadastro de Projeto
            </span>

            <section className="flex items-center gap-6">
              <Button
                disabled={showExpenses}
                onClick={() => setShowExpenses(true)}
                className="disabled:border-none disabled:transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 hover:text-gray-700 text-gray-100 font-bold bg-transparent border-2 border-dashed border-gray-100 hover:bg-gray-100"
              >
                <PlusCircle size={16} />
                Incluir despesa
              </Button>

              <Button
                disabled={showServices}
                onClick={() => setShowServices(true)}
                className="disabled:border-none disabled:transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 hover:text-gray-700 text-gray-100 font-bold bg-transparent border-2 border-dashed border-gray-100 hover:bg-gray-100"
              >
                <PlusCircle size={16} />
                Incluir serviço
              </Button>

              <Button
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
              defaultSelectedKeys={project && [project?.clientId]}
            >
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.fantasyName}
                </SelectItem>
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
            >
              {collaborators.map((collaborator) => (
                <SelectItem key={collaborator.id}>
                  {collaborator.name + ' ' + collaborator.lastName}
                </SelectItem>
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
              {...register('endDate', { required: false })}
              errorMessage={errors.endDate?.message}
              validationState={errors.endDate && 'invalid'}
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
              placeholder={id && ' '}
            />

            <Input
              id="hoursBalance"
              label="Balanço de horas"
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm min-w-fit',
                mainWrapper: 'max-w-sm min-w-fit',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('hoursBalance')}
              placeholder={id && ' '}
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
              placeholder={id && ' '}
            />
          </section>
        </form>

        {showExpenses && (
          <>
            <ProjectExpensesForm
              handleNewProjectExpense={onNewProjectExpense}
            />
            <section className="flex w-full justify-start max-w-7xl px-6 items-center gap-6">
              {expenses?.length > 0 &&
                expenses.map((expense, index) => (
                  <main
                    key={index}
                    className="flex items-center gap-6 justify-center bg-gray-700 px-5 py-4 max-w-fit rounded-lg"
                  >
                    <span className="text-sm text-gray-300">
                      {expense.description}
                    </span>
                    <span>R$ {expense.value},00</span>

                    <Card.Badge
                      status=""
                      icon={Trash2}
                      className=" text-red-500 bg-red-500/10 py-2 px-2 rounded-md"
                    />
                  </main>
                ))}
            </section>
          </>
        )}

        {showServices && (
          <>
            <ProjectServicesForm
              handleNewProjectService={onNewProjectService}
            />

            <section className="flex w-full justify-start max-w-7xl px-6 items-center gap-6">
              {services.length > 0 &&
                services.map((service, index) => (
                  <main
                    key={index}
                    className="flex items-center gap-6 justify-center bg-gray-700 px-5 py-4 max-w-fit rounded-lg"
                  >
                    <span className="text-sm text-gray-300">
                      {service.description}
                    </span>
                    <Card.Badge
                      status=""
                      icon={Trash2}
                      className=" text-red-500 bg-red-500/10 py-2 px-2 rounded-md"
                    />
                  </main>
                ))}
            </section>
          </>
        )}

        {showToast && <Toast message="Projeto criado com sucesso" />}
      </div>
    </div>
  )
}
