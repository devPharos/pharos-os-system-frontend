'use client'

import TipTap from '@/components/TipTap'
import { getUserData } from '@/hooks/useRegister'
import Header from '@/layouts/header'
import { Collaborator } from '@/types/collaborator'
import { Project } from '@/types/projects'
import { UserData } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import axios from 'axios'
import { Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

export default function CreateTicket() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const router = useRouter()

  const [user, setUser] = useState<UserData>()
  const priorities = ['Alta', 'Media', 'Baixa']

  const supportFormSchema = z.object({
    message: z.string().min(1, 'Descreva o problema'),
    collaboratorId: z.string().uuid('Selecione uma opção'),
    projectId: z.string().uuid('Selecione uma opção'),
    priority: z.enum(['Alta', 'Media', 'Baixa']),
    title: z.string().min(1, 'Insira um título'),
  })

  type SupportFormSchema = z.infer<typeof supportFormSchema>

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SupportFormSchema>({
    resolver: zodResolver(supportFormSchema),
  })

  const handleSupportFormSubmit: SubmitHandler<SupportFormSchema> = (
    data: SupportFormSchema,
  ) => {
    if (window !== undefined) {
      const localStorage = window.localStorage
      const token = localStorage.getItem('access_token')
      const body = {
        ...data,
      }
      axios
        .post('http://localhost:3333/support/ticket', body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          router.push('/support')
        })
        .catch(function (error) {
          console.error(error)
        })
    }
  }

  const handleUserData = async () => {
    const user = await getUserData()
    setUser(user)
  }

  useEffect(() => {
    handleUserData()

    if (window !== undefined) {
      const localStorage = window.localStorage
      const token = localStorage.getItem('access_token')

      axios
        .get('http://localhost:3333/list/collaborators', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(function (response) {
          const data = response.data
          setCollaborators(data)
        })
        .catch(function (error) {
          console.error(error)
        })

      axios
        .get('http://localhost:3333/projects', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setProjects(response.data.projects)
        })
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center gap-14">
      <Header />

      <div className="flex flex-col items-center w-full gap-2 pb-6">
        <form
          onSubmit={handleSubmit(handleSupportFormSubmit)}
          className="max-w-7xl w-full space-y-10 px-6"
        >
          <header className={'flex items-center justify-between'}>
            <span className="text-2xl font-bold text-white">
              Cadastro de ticket de suporte
            </span>

            <section className="flex items-center gap-6">
              <Button
                type="submit"
                className="disabled:border-none items-center disabled:transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 text-gray-700 bg-yellow-500 font-bold hover:bg-yellow-600"
              >
                <Save size={16} />
                Abrir ticket
              </Button>
            </section>
          </header>

          <section className="flex flex-wrap gap-6 justify-between">
            <Select
              id="collaboratorId"
              label="Colaborador"
              classNames={{
                trigger:
                  'bg-gray-700  data-[hover=true]:bg-gray-600 rounded-lg',
                listboxWrapper: 'max-h-[400px] rounded-lg',
                popover: 'bg-gray-700 rounded-lg ',
                base: 'max-w-sm',
              }}
              listboxProps={{
                itemClasses: {
                  base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
                },
              }}
              {...register('collaboratorId')}
              errorMessage={errors.collaboratorId?.message}
              validationState={errors.collaboratorId && 'invalid'}
            >
              {collaborators.map((collaborator) => (
                <SelectItem key={collaborator.id}>
                  {collaborator.name + ' ' + collaborator.lastName}
                </SelectItem>
              ))}
            </Select>

            <Select
              id="priority"
              label="Prioridade"
              classNames={{
                trigger:
                  'bg-gray-700  data-[hover=true]:bg-gray-600 rounded-lg',
                listboxWrapper: 'max-h-[400px] rounded-lg',
                popover: 'bg-gray-700 rounded-lg ',
                base: 'max-w-sm',
              }}
              listboxProps={{
                itemClasses: {
                  base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
                },
              }}
              {...register('priority')}
              errorMessage={errors.priority?.message}
              validationState={errors.priority && 'invalid'}
            >
              {priorities.map((priority) => (
                <SelectItem key={priority}>{priority}</SelectItem>
              ))}
            </Select>

            <Select
              id="projectId"
              label="Projeto"
              classNames={{
                trigger:
                  'bg-gray-700  data-[hover=true]:bg-gray-600 rounded-lg',
                listboxWrapper: 'max-h-[400px] rounded-lg',
                popover: 'bg-gray-700 rounded-lg ',
                base: 'max-w-sm',
              }}
              listboxProps={{
                itemClasses: {
                  base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
                },
              }}
              {...register('projectId')}
              errorMessage={errors.projectId?.message}
              validationState={errors.projectId && 'invalid'}
            >
              {projects
                .filter((project) => project.clientId === user?.clientId)
                .map((project, index) => (
                  <SelectItem key={project?.id || index}>
                    {project.name}
                  </SelectItem>
                ))}
            </Select>

            <Input
              id="title"
              label="Título"
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-full',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('title')}
              errorMessage={errors.title?.message}
              validationState={errors.title && 'invalid'}
            />

            <Controller
              control={control}
              name="message"
              render={({ field }) => (
                <TipTap
                  description={'Descreva o problema'}
                  onChange={field.onChange}
                />
              )}
            />
          </section>
        </form>
      </div>
    </div>
  )
}
