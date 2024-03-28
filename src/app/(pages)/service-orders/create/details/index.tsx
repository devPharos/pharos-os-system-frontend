'use client'

import { Project } from '@/app/(pages)/projects/create/page'
import { useUser } from '@/app/contexts/useUser'
import { getProjectServices, getProjects } from '@/functions/requests'
import { ProjectServices } from '@/types/projects'
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import { Save } from 'lucide-react'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { differenceInMinutes, parse } from 'date-fns'
import { OsDetailsFormHeader } from './os-detail-header'
import CreateOSExpenses, { ServiceOrderExpenses } from './expenses'
import { ServiceOrderExpensesSection } from './expenses/os-expenses-section'

const osFormDetailSchema = z.object({
  startDate: z.string().min(4, 'Insira uma hora válida'),
  endDate: z.string().min(4, 'Insira uma hora válida'),
  projectId: z.string().uuid('Selecione um projeto'),
  projectServiceId: z.string().uuid('Selecione um tipo de serviço'),
  description: z.string().min(1, 'Adicione uma descrição'),
})

export type OsFormDetailSchema = z.infer<typeof osFormDetailSchema>

export interface OSDetailsProject {
  name: string
  service: {
    description: string
  }
}

export interface OSDetails extends OsFormDetailSchema {
  id?: string
  project: OSDetailsProject
  index?: number
  expenses: ServiceOrderExpenses[]
}

interface CreateOsDetailsProps {
  clientId: string | undefined
  handleCreateServiceOrderDetail: (detail: OSDetails, index?: number) => void
  setOpenDetails: Dispatch<SetStateAction<boolean>>
  setDetailOpened: Dispatch<SetStateAction<OSDetails | undefined>>
  detailOpened: OSDetails | undefined
}

export default function CreateOSDetails({
  clientId,
  handleCreateServiceOrderDetail,
  setOpenDetails,
  setDetailOpened,
  detailOpened,
}: CreateOsDetailsProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [projectServices, setProjectServices] = useState<ProjectServices[]>([])
  const [openExpenses, setOpenExpenses] = useState(false)
  const [expenses, setExpenses] = useState<ServiceOrderExpenses[]>([])
  const [selectedProject, setSelectedProject] = useState<string | undefined>()
  const [expenseOpened, setExpenseOpened] = useState<ServiceOrderExpenses>()
  const { auth } = useUser()

  useEffect(() => {
    async function fetchData() {
      const projectsList = await getProjects(auth?.token, clientId)
      setProjects(projectsList)
    }

    fetchData()
  }, [auth?.token, clientId])

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<OsFormDetailSchema>({
    resolver: zodResolver(osFormDetailSchema),
    values: {
      description: detailOpened?.description ?? '',
      endDate: detailOpened?.endDate ?? '',
      projectId: detailOpened?.projectId ?? '',
      projectServiceId: detailOpened?.projectServiceId ?? '',
      startDate: detailOpened?.startDate ?? '',
    },
  })

  const handleGetProjectServices = useCallback(
    async (selectedKey?: any) => {
      const projectId = selectedKey.currentKey || selectedKey

      if (!projectId) return

      const projectServicesList = await getProjectServices(
        auth?.token,
        projectId,
      )
      setProjectServices(projectServicesList)
      setSelectedProject(projectId)
    },
    [auth],
  )

  useEffect(() => {
    async function fetchData() {
      if (detailOpened && detailOpened.projectId) {
        await handleGetProjectServices(detailOpened.projectId)
        setExpenses(detailOpened.expenses)
      }
    }

    fetchData()
  }, [detailOpened, handleGetProjectServices])

  console.log(detailOpened)

  async function handleServiceOrderDetailsSubmit({
    description,
    endDate,
    projectId,
    projectServiceId,
    startDate,
  }: OsFormDetailSchema) {
    const projectFounded = projects.find((project) => project.id === projectId)
    const servicesFounded = projectServices.find(
      (service) => service.id === projectServiceId,
    )

    const project: OSDetailsProject = {
      name: projectFounded?.name ?? '',
      service: {
        description: servicesFounded?.description ?? '',
      },
    }

    const isHourValid =
      differenceInMinutes(
        parse(endDate, 'HH:mm', new Date()),
        parse(startDate, 'HH:mm', new Date()),
      ) > 0

    if (!isHourValid) {
      setError('startDate', {
        message: 'A hora inicial deve ser menor que a hora final',
      })

      return
    }

    handleCreateServiceOrderDetail(
      {
        id: detailOpened?.id,
        description,
        endDate,
        projectId,
        projectServiceId,
        startDate,
        project,
        expenses,
      },
      detailOpened?.index,
    )

    handleClearForm()
  }

  function handleClearForm() {
    reset({
      description: '',
      endDate: '',
      projectId: undefined,
      projectServiceId: undefined,
      startDate: '',
    })

    setOpenDetails(false)
    setDetailOpened(undefined)
  }

  function onDetailExpenseCreation(
    expense: ServiceOrderExpenses,
    index?: number,
  ) {
    if (expenses) {
      if (index || index === 0) {
        const newExpensesList = [...expenses]
        newExpensesList[index] = expense

        setExpenses(newExpensesList)
        setOpenExpenses(false)
        setExpenseOpened(undefined)

        return
      }

      const newExpensesList = [...expenses]
      newExpensesList.push(expense)

      setExpenses(newExpensesList)
      setOpenExpenses(false)
      setExpenseOpened(undefined)
    }
  }

  return (
    <main className="w-full space-y-10">
      <form
        onSubmit={handleSubmit(handleServiceOrderDetailsSubmit)}
        className="flex flex-col gap-8"
      >
        <header className={'flex items-center justify-between'}>
          <span className="text-2xl font-bold text-white">
            Adicionar detalhamento
          </span>

          <section className="flex items-center gap-6">
            <Button
              className="rounded-full bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 font-bold"
              onClick={handleClearForm}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="disabled:border-none items-center disabled:transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 text-gray-700 bg-gray-100 font-bold hover:bg-gray-200"
            >
              <Save size={16} />
              Salvar detalhamento
            </Button>
          </section>
        </header>

        <OsDetailsFormHeader
          setOpenExpenses={setOpenExpenses}
          openExpenses={openExpenses}
          selectedProject={selectedProject}
        />

        <section className="flex flex-wrap gap-6 justify-between">
          <Select
            label="Projeto"
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
            onSelectionChange={async (keys) =>
              await handleGetProjectServices(keys)
            }
            {...register('projectId')}
            errorMessage={errors.projectId?.message}
            isInvalid={!!errors.projectId}
            defaultSelectedKeys={detailOpened && [detailOpened.projectId]}
          >
            {projects.map((project, index) => (
              <SelectItem key={project.id || index}>{project.name}</SelectItem>
            ))}
          </Select>

          <Select
            label="Serviço"
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
            {...register('projectServiceId')}
            errorMessage={errors.projectServiceId?.message}
            isInvalid={!!errors.projectServiceId}
            defaultSelectedKeys={
              detailOpened && [detailOpened.projectServiceId]
            }
          >
            {projectServices.map((service) => (
              <SelectItem key={service.id}>{service.description}</SelectItem>
            ))}
          </Select>

          <Input
            id="startDate"
            type="time"
            label="Hora de início"
            placeholder=" "
            classNames={{
              label: 'text-gray-300',
              base: 'max-w-sm',
              inputWrapper:
                'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
            }}
            step={900}
            {...register('startDate')}
            errorMessage={errors.startDate?.message}
            isInvalid={!!errors.startDate}
          />
          <Input
            id="endDate"
            type="time"
            label="Hora de término"
            placeholder=" "
            step={900}
            classNames={{
              label: 'text-gray-300',
              base: 'max-w-sm',
              inputWrapper:
                'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
            }}
            {...register('endDate')}
            errorMessage={errors.endDate?.message}
            isInvalid={!!errors.endDate}
          />

          <Textarea
            id="description"
            label="Descrição"
            classNames={{
              label: 'text-gray-300',
              inputWrapper:
                'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
            }}
            {...register('description')}
            errorMessage={errors.description?.message}
            validationState={errors.description && 'invalid'}
          />
        </section>
      </form>

      {openExpenses && (
        <CreateOSExpenses
          setExpenseOpened={setExpenseOpened}
          setOpenExpenses={setOpenExpenses}
          handleCreateServiceOrderDetailExpense={onDetailExpenseCreation}
          projectId={selectedProject}
          expenseOpened={expenseOpened}
        />
      )}

      {expenses.length > 0 && (
        <ServiceOrderExpensesSection
          setOpenExpenses={setOpenExpenses}
          expenses={expenses}
          setExpenses={setExpenses}
          setExpenseOpened={setExpenseOpened}
        />
      )}
    </main>
  )
}
