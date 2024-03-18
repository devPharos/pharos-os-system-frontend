'use client'

import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import { Save } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ProjectInfoHeader } from './project-info-header'
import { useEffect, useState } from 'react'
import {
  createProject,
  deleteProjectExpense,
  deleteProjectService,
  findProject,
  getClients,
  getCollaborators,
  updateProject,
} from '@/functions/requests'
import { Client } from '@/types/client'
import { useUser } from '@/app/contexts/useUser'
import { Collaborator } from '@/types/collaborator'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import ProjectServicesForm, {
  ProjectServices,
  ProjectServicesFormSchema,
} from './services'
import { ExpenseOpened, ServiceOpened } from '@/app/hooks/useProjects'
import { ProjectServiceSection } from './services/project-service-section'
import ProjectExpensesForm, { ProjectExpenses } from './expenses'
import { ProjectExpensesSection } from './expenses/project-expense-section'
import { ProjectClient, ProjectCollaborator } from '@/types/projects'
import { toast } from 'sonner'
import Loading from '@/components/Loading'
import { handleFormatCurrency } from '@/functions/auxiliar'

const createProjectSchema = z.object({
  clientId: z.string().uuid(),
  coordinatorId: z.string().uuid(),
  name: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  deliveryForecast: z.string(),
  hoursForecast: z.string().optional().nullable(),
  hoursBalance: z.string().optional().nullable(),
  hourValue: z.string().min(1),
})

type CreateProjectSchema = z.infer<typeof createProjectSchema>

export interface Project {
  id?: string
  clientId: string
  coordinatorId: string
  name: string
  startDate: string
  status?: 'NaoIniciado' | 'Iniciado' | 'Finalizado' | 'Cancelado'
  hide?: boolean
  endDate: undefined | string
  deliveryForecast: string
  hoursForecast: string | undefined
  hoursBalance: string | undefined
  hourValue: string
  projectsExpenses: ProjectExpenses[]
  projectsServices: ProjectServices[]
  collaborator?: ProjectCollaborator
  hoursToBeBilled?: number
  client?: ProjectClient
}

export default function CreateProject() {
  const [clients, setClients] = useState<Client[]>([])
  const [coordinators, setCoordinators] = useState<Collaborator[]>([])
  const [openService, setOpenService] = useState(false)
  const [services, setServices] = useState<ProjectServices[]>([])
  const [serviceOpened, setServiceOpened] = useState<ServiceOpened>()
  const [openExpense, setOpenExpense] = useState(false)
  const [expenses, setExpenses] = useState<ProjectExpenses[]>([])
  const [expenseOpened, setExpenseOpened] = useState<ExpenseOpened>()
  const [project, setProject] = useState<Project>()

  const router = useRouter()
  const { auth } = useUser()

  const searchParams = useSearchParams()
  const params = Array.from(searchParams.values())
  const id = params[0]

  useEffect(() => {
    async function fetchData() {
      const clientsList = await getClients(auth?.token)
      const coordinatorsList = await getCollaborators(auth?.token)
      setClients(clientsList)
      setCoordinators(coordinatorsList)

      if (id) {
        const projectFounded = await findProject(auth?.token, id)
        setProject(projectFounded)
      }
    }

    fetchData()
  }, [auth?.token, id])

  useEffect(() => {
    if (project) {
      setExpenses(project.projectsExpenses)
      setServices(project.projectsServices)
    }
  }, [project])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
    values: {
      clientId: project?.clientId ?? '',
      coordinatorId: project?.coordinatorId ?? '',
      deliveryForecast: project?.deliveryForecast ?? '',
      hoursForecast: project?.hoursForecast ?? '',
      hourValue: project?.hourValue ?? '',
      name: project?.name ?? '',
      startDate: project?.startDate ?? '',
      endDate: project?.endDate ?? '',
      hoursBalance: project?.hoursBalance ?? '',
    },
  })

  function onServiceCreation(
    service: ProjectServicesFormSchema,
    index?: number,
  ) {
    if (services) {
      if (index || index === 0) {
        const newServicesList = [...services]
        newServicesList[index] = service

        setServices(newServicesList)
        setServiceOpened(undefined)

        return
      }

      const newServicesList = [...services]
      newServicesList.push(service)

      setServices(newServicesList)
    }
  }

  function onExpenseCreation(expense: ProjectExpenses, index?: number) {
    if (expenses) {
      if (index || index === 0) {
        const newExpensesList = [...expenses]
        newExpensesList[index] = expense

        setExpenses(newExpensesList)
        setExpenseOpened(undefined)

        return
      }

      const newExpensesList = [...expenses]
      newExpensesList.push(expense)

      setExpenses(newExpensesList)
    }
  }

  async function handleProjectSubmit(data: CreateProjectSchema) {
    try {
      const body: Project = {
        clientId: data.clientId,
        coordinatorId: data.coordinatorId,
        deliveryForecast: data.deliveryForecast,
        endDate: data.endDate === null ? undefined : data.endDate,
        hoursBalance:
          data.hoursBalance === null ? undefined : data.hoursBalance,
        hoursForecast:
          data.hoursForecast === null ? undefined : data.hoursForecast,
        hourValue: data.hourValue,
        name: data.name,
        startDate: data.startDate,
        projectsExpenses: expenses || [],
        projectsServices: services || [],
      }

      if (!id) {
        await createProject(auth?.token, body)
        toast.success('Projeto criado com sucesso!')
      }

      if (id) {
        body.projectsServices.forEach(async (service) => {
          if (service.deleted && service.id) {
            await deleteProjectService(auth?.token, service.id, id)
          }
        })

        body.projectsExpenses.forEach(async (expense) => {
          if (expense.deleted && expense.id) {
            await deleteProjectExpense(auth?.token, expense.id, id)
          }
        })

        const projectServiceBody = body.projectsServices.filter(
          (service) => !service.deleted,
        )

        const projectExpenseBody = body.projectsExpenses.filter(
          (expense) => !expense.deleted,
        )

        const newBody = {
          ...body,
          projectsServices: projectServiceBody,
          projectsExpenses: projectExpenseBody,
        }

        await updateProject(auth?.token, newBody, id)
        toast.success('Projeto atualizado com sucesso!')
      }
      router.push('/projects')
    } catch (error) {
      console.log(error)
      toast.error(
        `${id ? 'Falha ao atualizar projeto' : 'Falha ao criar projeto'}`,
      )
    }
  }

  if (id && !project) {
    return <Loading />
  }

  return (
    <main className="max-w-7xl w-full space-y-10 px-6 pt-10">
      <form
        onSubmit={handleSubmit(handleProjectSubmit)}
        className="flex flex-col gap-10"
      >
        <header className={'flex items-center justify-between'}>
          <span className="text-2xl font-bold text-white">
            Cadastro de Projeto
          </span>

          <section className="flex items-center gap-6">
            <Button
              className="rounded-full bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 font-bold"
              onClick={() => router.push('/projects')}
            >
              Cancelar
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

        <ProjectInfoHeader
          openExpense={openExpense}
          openService={openService}
          setOpenExpense={setOpenExpense}
          setOpenService={setOpenService}
        />

        <section className="flex justify-between flex-wrap gap-6">
          <Select
            id="clientId"
            label="Cliente"
            classNames={{
              trigger: 'bg-gray-700  data-[hover=true]:bg-gray-600 rounded-lg',
              listboxWrapper: 'max-h-[400px] rounded-lg',
              base: 'max-w-sm',
            }}
            listboxProps={{
              itemClasses: {
                base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
              },
            }}
            popoverProps={{
              classNames: {
                base: 'bg-gray-700 rounded-lg',
              },
            }}
            {...register('clientId')}
            errorMessage={errors.clientId?.message}
            isInvalid={!!errors.clientId}
            defaultSelectedKeys={project && [project.clientId]}
          >
            {clients?.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.fantasyName}
              </SelectItem>
            ))}
          </Select>

          <Select
            id="coordinatorId"
            label="Coordenador"
            classNames={{
              trigger: 'bg-gray-700  data-[hover=true]:bg-gray-600 rounded-lg',
              listboxWrapper: 'max-h-[400px] rounded-lg',
              base: 'max-w-sm',
            }}
            listboxProps={{
              itemClasses: {
                base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
              },
            }}
            popoverProps={{
              classNames: {
                base: 'bg-gray-700 rounded-lg',
              },
            }}
            {...register('coordinatorId')}
            errorMessage={errors.coordinatorId?.message}
            isInvalid={!!errors.coordinatorId}
            defaultSelectedKeys={project && [project.coordinatorId]}
          >
            {coordinators?.map((coordinator) => (
              <SelectItem key={coordinator.id} value={coordinator.id}>
                {coordinator.name + ' ' + coordinator.lastName}
              </SelectItem>
            ))}
          </Select>

          <Input
            id="name"
            label="Nome"
            classNames={{
              label: 'text-gray-300',
              base: 'max-w-sm',
              inputWrapper:
                'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
            }}
            {...register('name')}
            errorMessage={errors.name?.message}
            isInvalid={!!errors.name}
            placeholder={id && ' '}
          />

          <Input
            id="startDate"
            type="date"
            label="Data de início"
            placeholder=" "
            classNames={{
              label: 'text-gray-300',
              base: 'max-w-sm',
              inputWrapper:
                'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
            }}
            {...register('startDate')}
            errorMessage={errors.startDate?.message}
            isInvalid={!!errors.startDate}
          />

          {id && (
            <Input
              id="endDate"
              type="date"
              label="Data de término"
              placeholder=" "
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('endDate', { required: false })}
              errorMessage={errors.endDate?.message}
              isInvalid={!!errors.endDate}
            />
          )}

          <Input
            id="deliveryForecast"
            type="date"
            label="Previsão de entrega"
            placeholder=" "
            classNames={{
              label: 'text-gray-300',
              base: 'max-w-sm',
              inputWrapper:
                'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
            }}
            {...register('deliveryForecast')}
            errorMessage={errors.deliveryForecast?.message}
            isInvalid={!!errors.deliveryForecast}
          />

          <Input
            id="hoursForecast"
            label="Previsão de horas"
            classNames={{
              label: 'text-gray-300',
              base: 'max-w-sm',
              inputWrapper:
                'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
            }}
            {...register('hoursForecast')}
            placeholder={id && ' '}
          />

          {id && (
            <Input
              id="hoursBalance"
              label="Total de horas utilizadas"
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('hoursBalance')}
              placeholder={id && project?.hoursBalance && ' '}
            />
          )}

          <Input
            id="hourValue"
            label="Valor da hora"
            classNames={{
              label: 'text-gray-300',
              base: 'max-w-sm',
              inputWrapper:
                'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
            }}
            {...register('hourValue')}
            errorMessage={errors.hourValue?.message}
            isInvalid={!!errors.hourValue}
            placeholder={id && ' '}
            onChange={handleFormatCurrency}
          />
        </section>
      </form>

      {openService && (
        <ProjectServicesForm
          serviceOpened={serviceOpened}
          setOpenService={setOpenService}
          handleCreateProjectService={onServiceCreation}
        />
      )}

      {services && services.length > 0 && (
        <ProjectServiceSection
          setServices={setServices}
          setOpenService={setOpenService}
          setServiceOpened={setServiceOpened}
          services={services}
        />
      )}

      {openExpense && (
        <ProjectExpensesForm
          expenseOpened={expenseOpened}
          setOpenExpense={setOpenExpense}
          handleCreateProjectExpense={onExpenseCreation}
        />
      )}
      {expenses && expenses.length > 0 && (
        <ProjectExpensesSection
          setExpenseOpened={setExpenseOpened}
          setExpenses={setExpenses}
          setOpenExpense={setOpenExpense}
          expenses={expenses}
        />
      )}
    </main>
  )
}
