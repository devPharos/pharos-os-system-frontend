'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import { Clock, DollarSign, Save, Search, Trash2 } from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Projects, ProjectServices } from '@/types/projects'
import CreateOSExpenses from '../expenses'
import {
  ServiceOrderDetail,
  ProjectExpenses,
  ServiceOrderExpenses,
} from '@/types/service-order'
import { format, parseISO } from 'date-fns'
import { Card } from '@/components/Card'
import { useSearchParams } from 'next/navigation'
import { useRegister } from '@/hooks/useRegister'

interface OSDetailsProps {
  clientId: string
  handleOSDetailsSave: (osDetails: ServiceOrderDetail) => void
  osDetail?: ServiceOrderDetail
  osExpenses?: ServiceOrderExpenses[]
  hasError?: boolean
}

const osFormSchema = z.object({
  startDate: z.string().min(4, 'Insira uma hora válida'),
  endDate: z.string().min(4, 'Insira uma hora válida'),
  projectId: z.string().uuid('Selecione um projeto'),
  projectServiceId: z.string().uuid('Selecione um tipo de serviço'),
  description: z.string().min(1, 'Adicione uma descrição'),
})

export type TOsDetailsFormData = z.infer<typeof osFormSchema>

export default function CreateOSDetails({
  clientId,
  handleOSDetailsSave,
  osDetail,
  hasError = false,
  osExpenses,
}: OSDetailsProps) {
  const [loading, setLoading] = useState(false)
  const [newExpense, setNewExpense] = useState(false)
  const [projects, setProjects] = useState<Projects[]>([])
  const [projectServices, setProjectServices] = useState<ProjectServices[]>([])
  const [projectId, setProjectId] = useState<string | null>(null)
  const [projectExpenses, setProjectExpenses] = useState<ProjectExpenses[]>([])
  const [projectExpense, setProjectExpense] = useState<ProjectExpenses>()
  const searchParams = useSearchParams()
  const params = Array.from(searchParams.values())
  const { token } = useRegister()
  const id = params[0]

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TOsDetailsFormData>({
    resolver: zodResolver(osFormSchema),
    defaultValues: {
      description: id && osDetail?.description,
      endDate: id && format(parseISO(osDetail?.endDate || ''), 'HH:mm'),
      startDate: id && format(parseISO(osDetail?.startDate || ''), 'HH:mm'),
      projectId: id && osDetail?.project.id,
      projectServiceId: id && osDetail?.projectServices.id,
    },
  })

  const getProjectServiceName = (projectServiceId: string) => {
    const projectService = projectServices.find(
      (project) => project.id === projectServiceId,
    )

    return projectService?.description
  }

  const getProjectName = (projectId: string) => {
    const project = projects.find((project) => project.id === projectId)

    return project?.name
  }

  const handleOSFormSubmit: SubmitHandler<TOsDetailsFormData> = (
    data: TOsDetailsFormData,
  ) => {
    const projectServiceName = getProjectServiceName(data.projectServiceId)
    const projectName = getProjectName(data.projectId)

    const osDetails: ServiceOrderDetail = {
      description: data.description,
      endDate: data.endDate,
      startDate: data.startDate,
      project: {
        id: data.projectId,
        name: projectName || '',
        projectsExpenses: projectExpenses,
      },
      projectServices: {
        id: data.projectServiceId,
        description: projectServiceName,
      },
    }

    handleOSDetailsSave(osDetails)
  }

  useEffect(() => {
    if (osDetail) {
      setProjectId(osDetail.project.id)
      handleProjectServices(osDetail.project.id)
    }

    setLoading(true)
    const body = {
      clientId,
    }

    if (hasError) {
      setError('startDate', {
        message: 'Já existe uma OS nesse horário',
      })

      setError('endDate', {
        message: 'Já existe uma OS nesse horário',
      })
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
        data: {
          body,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false)
        setProjects(response.data.projects)
      })
  }, [clientId, token, osDetail, hasError])

  const handleProjectServices = (projectId: string) => {
    setLoading(true)
    const body = {
      projectId,
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/project-services`, {
        data: {
          body,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false)
        setProjectServices(response.data.projectsServices)
      })
  }

  const handleSelectsData = (selectedKey: any) => {
    setLoading(true)
    const selectedProjectId = selectedKey.currentKey

    setProjectId(selectedProjectId)

    handleProjectServices(selectedProjectId)
  }

  const onExpenseSave = (expense: ProjectExpenses) => {
    const newExpensesList: ProjectExpenses[] = [...projectExpenses]

    newExpensesList.push(expense)
    setProjectExpenses(newExpensesList)
    setNewExpense(false)
  }

  const handleCardExpenseClick = (expense: ProjectExpenses) => {
    setNewExpense(true)

    if (osDetail?.project.projectsExpenses) {
      setProjectId(osDetail.project?.id)
      setProjectExpense(expense)
    }
  }

  const handleDeleteExpense = (expenseid: string | undefined) => {
    if (expenseid && typeof window !== 'undefined') {
      axios
        .delete(
          `${process.env.NEXT_PUBLIC_API_URL}/delete/service-order/expense`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              serviceorderexpenseid: expenseid,
              serviceorderid: id,
            },
          },
        )
        .then((response) => {
          setProjectExpenses(response.data)
          setLoading(false)
        })
    }
  }
  console.log(osDetail)

  return (
    <div className="flex flex-col items-center w-full gap-2 pb-6">
      <form
        onSubmit={handleSubmit(handleOSFormSubmit)}
        className="max-w-7xl w-full space-y-10 px-6"
      >
        <header className={'flex items-center justify-between'}>
          <span className="text-2xl font-bold text-white">Detalhamento</span>

          <section className="flex items-center gap-6">
            <Button
              disabled={!projectId}
              onClick={() => setNewExpense(true)}
              className="disabled:border-none disabled:transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 hover:text-gray-700 text-gray-100 font-bold bg-transparent border-2 border-dashed border-gray-100 hover:bg-gray-100"
            >
              <DollarSign size={16} />
              Incluir despesa
            </Button>

            <Button
              type="submit"
              className="disabled:border-none disabled:transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 hover:text-gray-700 text-yellow-500 font-bold bg-transparent border-2 border-dashed border-yellow-500 hover:bg-yellow-500"
            >
              <Save size={16} />
              Salvar detalhamento
            </Button>
          </section>
        </header>

        <section className={'space-y-6'}>
          <section className="flex items-center gap-6">
            <Select
              id="projectId"
              label="Projeto"
              classNames={{
                trigger: 'bg-gray-700 data-[hover=true]:bg-gray-600 rounded-lg',
                listboxWrapper: 'max-h-[400px] rounded-lg',
                popover: 'bg-gray-700 rounded-lg',
              }}
              listboxProps={{
                itemClasses: {
                  base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
                },
              }}
              selectorIcon={<Search />}
              {...register('projectId')}
              errorMessage={errors.projectId?.message}
              validationState={errors.projectId && 'invalid'}
              onSelectionChange={(keys) => handleSelectsData(keys)}
              defaultSelectedKeys={osDetail ? [osDetail?.project.id] : []}
            >
              {projects?.map((project) => {
                return <SelectItem key={project.id}>{project.name}</SelectItem>
              })}
            </Select>

            <Select
              id="projectServiceId"
              label="Tipo de serviço"
              classNames={{
                trigger: 'bg-gray-700 data-[hover=true]:bg-gray-600 rounded-lg',
                listboxWrapper: 'max-h-[400px] rounded-lg',
                popover: 'bg-gray-700 rounded-lg',
              }}
              listboxProps={{
                itemClasses: {
                  base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
                },
              }}
              {...register('projectServiceId')}
              errorMessage={errors.projectServiceId?.message}
              validationState={errors.projectServiceId && 'invalid'}
              defaultSelectedKeys={
                osDetail ? [osDetail?.projectServices?.id || ''] : []
              }
            >
              {projectServices?.map((service) => {
                return (
                  <SelectItem key={service.id}>
                    {service.description}
                  </SelectItem>
                )
              })}
            </Select>

            <Input
              id="startDate"
              type="time"
              placeholder=" "
              label="Hora inicial"
              step={900}
              classNames={{
                label: 'text-gray-300',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              endContent={<Clock className="text-gray-300" size={20} />}
              {...register('startDate')}
              errorMessage={errors.startDate?.message}
              validationState={errors.startDate && 'invalid'}
            />

            <Input
              id="endDate"
              type="time"
              placeholder=" "
              step={900}
              label="Hora final"
              classNames={{
                label: 'text-gray-300',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              endContent={<Clock className="text-gray-300" size={20} />}
              {...register('endDate')}
              errorMessage={errors.endDate?.message}
              validationState={errors.endDate && 'invalid'}
            />
          </section>
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

      {newExpense && projectId && (
        <div className="flex flex-col gap-3 w-full items-center">
          <CreateOSExpenses
            projectId={projectId}
            handleExpenseSave={onExpenseSave}
            expense={projectExpense}
            osExpenses={osExpenses?.find(
              (exp) => projectExpense?.id === exp.projectExpenses.id,
            )}
          />
        </div>
      )}

      {
        <section className="w-full max-w-7xl px-6 flex gap-6">
          {osExpenses &&
            osExpenses.map((expense) => (
              <main
                key={expense.projectExpenses.id}
                className="flex items-center gap-6 justify-center cursor-pointer bg-gray-700 px-5 py-4 max-w-fit rounded-lg"
              >
                <span
                  className="text-sm text-gray-300"
                  onClick={() =>
                    handleCardExpenseClick(expense.projectExpenses)
                  }
                >
                  {expense?.projectExpenses.description}
                </span>
                <span>R$ {expense.projectExpenses.value},00</span>

                <Card.Badge
                  status=""
                  icon={Trash2}
                  className=" text-red-500 cursor-pointer bg-red-500/10 py-2 px-2 rounded-md"
                  onClick={() => handleDeleteExpense(expense?.id)}
                />
              </main>
            ))}

          {projectExpenses &&
            projectExpenses.map((expense, index) => (
              <main
                key={expense?.id || index}
                className="flex items-center gap-6 cursor-pointer justify-center bg-gray-700 px-5 py-4 max-w-fit rounded-lg"
                onClick={() => handleCardExpenseClick(expense)}
              >
                <span className="text-sm text-gray-300">
                  {expense?.description}
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
      }
    </div>
  )
}
