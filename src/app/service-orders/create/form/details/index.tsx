'use client'

import { getUserData, useRegister } from '@/hooks/useRegister'
import Header from '@/layouts/header'
import { UserData } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import { Clock, DollarSign, Save, Search, Trash2 } from 'lucide-react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Projects,
  ProjectServices,
  ProjectExpenses,
  ProjectDetails,
} from '@/types/projects'
import CreateOSExpenses from '../expenses'
import {
  ServiceOrder,
  ServiceOrderDetails,
  ServiceOrderExpense,
} from '@/types/service-order'
import { parseDate } from '@/functions/auxiliar'
import { format, parseISO } from 'date-fns'
import { Card } from '@/components/Card'

interface OSDetailsProps {
  clientId: string
  handleOSDetailsSave: (osDetails: ServiceOrderDetails) => void
  osDetail?: ServiceOrderDetails
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
}: OSDetailsProps) {
  const localStorage = window.localStorage
  const token: string = localStorage.getItem('access_token') || ''
  const userData: UserData = getUserData(token)
  const [loading, setLoading] = useState(false)
  const [newExpense, setNewExpense] = useState(false)
  const [projects, setProjects] = useState<Projects[]>([])
  const [projectServices, setProjectServices] = useState<ProjectServices[]>([])
  const [projectId, setProjectId] = useState<string | null>(null)
  const [projectExpenses, setProjectExpenses] = useState<ServiceOrderExpense[]>(
    [],
  )

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TOsDetailsFormData>({
    resolver: zodResolver(osFormSchema),
    defaultValues: {
      description: osDetail?.projectDetails.description,
      endDate: osDetail?.projectDetails.endDate.toString(),
      startDate: osDetail?.projectDetails.startDate.toString(),
      projectId: osDetail?.projectDetails.projectId,
      projectServiceId: osDetail?.projectDetails.projectServiceId,
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
    const endDate = parseISO(data.endDate)
    const startDate = parseISO(data.startDate)

    const projectServiceName = getProjectServiceName(data.projectServiceId)
    const projectName = getProjectName(data.projectId)
    const totalHours =
      startDate.getTime() - endDate.getTime() / (1000 * 60 * 60)

    if (projectServiceName && projectName) {
      const projectDetails: ProjectDetails = {
        ...data,
        endDate,
        startDate,
        totalHours,
        projectServiceType: projectServiceName,
        projectName,
      }

      const osDetails = {
        projectDetails,
        projectExpenses,
      }

      handleOSDetailsSave(osDetails)
    }

    reset()
  }

  useEffect(() => {
    if (osDetail) {
      setProjectId(osDetail.projectDetails.projectId)
      handleProjectServices(osDetail.projectDetails.projectId)
    }

    setLoading(true)
    const body = {
      clientId,
    }

    axios
      .get('http://localhost:3333/projects', {
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
  }, [clientId, token, osDetail])

  const handleProjectServices = (projectId: string) => {
    setLoading(true)
    const body = {
      projectId,
    }

    axios
      .get('http://localhost:3333/project-services', {
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

  const onExpenseSave = (expense: ServiceOrderExpense) => {
    const newExpensesList: ServiceOrderExpense[] = [...projectExpenses]

    newExpensesList.push(expense)
    setProjectExpenses(newExpensesList)
    setNewExpense(false)
  }

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
              defaultSelectedKeys={
                osDetail ? [osDetail?.projectDetails.projectId] : []
              }
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
                osDetail ? [osDetail?.projectDetails.projectServiceId] : []
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
              classNames={{
                label: 'text-gray-300',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              endContent={<Clock className="text-gray-300" size={20} />}
              {...register('startDate')}
              errorMessage={errors.startDate?.message}
              validationState={errors.startDate && 'invalid'}
              value={
                osDetail &&
                format(
                  new Date(osDetail?.projectDetails.startDate),
                  'HH:mm',
                ).toString()
              }
            />

            <Input
              id="endDate"
              type="time"
              placeholder=" "
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
              value={
                osDetail &&
                format(
                  new Date(osDetail?.projectDetails.endDate),
                  'HH:mm',
                ).toString()
              }
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
            defaultValue={osDetail ? osDetail.projectDetails.description : ''}
          />
        </section>
      </form>

      {newExpense && projectId && (
        <div className="flex flex-col gap-3 w-full items-center">
          <CreateOSExpenses
            projectId={projectId}
            handleExpenseSave={onExpenseSave}
          />
        </div>
      )}

      {
        <section className="w-full max-w-7xl px-6 flex gap-6">
          {osDetail &&
            osDetail.projectExpenses.map((expense) => (
              <main
                key={expense.projectExpenseId}
                className="flex items-center gap-6 justify-center bg-gray-700 px-5 py-4 max-w-fit rounded-lg"
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
          {projectExpenses &&
            projectExpenses.map((expense) => (
              <main
                key={expense.projectExpenseId}
                className="flex items-center gap-6 justify-center bg-gray-700 px-5 py-4 max-w-fit rounded-lg"
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
