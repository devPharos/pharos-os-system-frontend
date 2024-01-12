'use client'

import HTMLRenderer from '@/components/HTMLRenderer'
import Loading from '@/components/Loading'
import TipTap from '@/components/TipTap'
import Toast from '@/components/Toast'
import { useRegister } from '@/hooks/useRegister'
import Header from '@/layouts/header'
import { Collaborator } from '@/types/collaborator'
import { Project } from '@/types/projects'
import { SupportTicketMessage, Ticket } from '@/types/support'
import { UserData } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, Button, Input, Select, SelectItem } from '@nextui-org/react'
import axios from 'axios'
import { format } from 'date-fns'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

export default function SupportTicket() {
  const [loading, setLoading] = useState(false)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [user, setUser] = useState<UserData>()
  const [messages, setMessages] = useState<SupportTicketMessage[]>([])
  const searchParams = useSearchParams()
  const [showToast, setShowToast] = useState(false)
  const params = Array.from(searchParams.values())
  const [ticket, setTicket] = useState<Ticket>()
  const priorities: string[] = ['Alta', 'Media', 'Baixa']
  const status: string[] = ['Atraso', 'NaoIniciado', 'Iniciado', 'Finalizado']
  const helpers: string[] = [
    'Desenvolvimento',
    'Suporte',
    'Infraestrutura',
    'Modulos',
    'Faturamento',
  ]
  const id = params[0]
  const router = useRouter()
  const token = localStorage.getItem('access_token')

  const supportUpdateFormSchema = z.object({
    collaboratorId: z.string().uuid('Selecione uma opção'),
    projectId: z.string().uuid('Selecione uma opção'),
    status: z.enum(['Atraso', 'NaoIniciado', 'Iniciado', 'Finalizado']),
    priority: z.enum(['Alta', 'Media', 'Baixa']),
    helper: z.enum([
      'Desenvolvimento',
      'Suporte',
      'Infraestrutura',
      'Modulos',
      'Faturamento',
    ]),
    endDate: z.coerce.date(),
  })

  type SupportUpdateFormSchema = z.infer<typeof supportUpdateFormSchema>

  const updateForm = useForm<SupportUpdateFormSchema>({
    resolver: zodResolver(supportUpdateFormSchema),
    defaultValues: async () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/ticket`, {
          headers: {
            Authorization: `Bearer ${token}`,
            id,
          },
        })
        .then((response) => {
          setLoading(false)
          return response.data
        })
        .catch(function (error) {
          console.error(error)
        }),
  })

  const handleUpdateSupportFormSubmit: SubmitHandler<
    SupportUpdateFormSchema
  > = (data: SupportUpdateFormSchema) => {
    if (typeof window !== 'undefined') {
      const localStorage = window.localStorage
      const token = localStorage.getItem('access_token')
      const body = {
        id,
        ...data,
      }
      axios
        .put(`${process.env.NEXT_PUBLIC_API_URL}/update/support/ticket`, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setShowToast(true)

          setInterval(() => {
            setShowToast(false)
          }, 3000)
        })
        .catch(function (error) {
          console.error(error)
        })
    }
  }

  const supportFormSchema = z.object({
    message: z.string().min(1, 'Descreva o problema'),
  })

  type SupportFormSchema = z.infer<typeof supportFormSchema>

  const { reset, handleSubmit, control } = useForm<SupportFormSchema>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: async () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/ticket`, {
          headers: {
            Authorization: `Bearer ${token}`,
            id,
          },
        })
        .then((response) => {
          setLoading(false)
          return response.data
        })
        .catch(function (error) {
          console.error(error)
        }),
  })

  const handleSupportFormSubmit: SubmitHandler<SupportFormSchema> = (
    data: SupportFormSchema,
  ) => {
    setLoading(true)
    if (typeof window !== 'undefined') {
      const localStorage = window.localStorage
      const token = localStorage.getItem('access_token')
      const body = {
        ...data,
        userId: user?.userId,
        supportId: id,
      }
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/ticket/message`, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setMessages(response.data)
          setLoading(false)
          reset()
        })
        .catch(function (error) {
          setLoading(false)
          console.error(error)
        })
    }
  }

  useEffect(() => {
    setLoading(true)
    if (typeof window !== 'undefined') {
      const localStorage = window.localStorage
      const token = localStorage.getItem('access_token')

      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/ticket`, {
          headers: {
            Authorization: `Bearer ${token}`,
            id,
          },
        })
        .then((response) => {
          setLoading(false)
          setMessages(response.data.SupportMessage)
          setTicket(response.data)
        })

      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/list/project/collaborators`, {
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
        .get(`${process.env.NEXT_PUBLIC_API_URL}/list/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setProjects(response.data)
        })
    }
  }, [id])

  console.log(ticket)

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      {loading ? (
        <Loading />
      ) : (
        <main className="flex flex-col gap-16 max-w-7xl w-full px-6 py-14">
          <header className="w-full flex justify-between items-center">
            <span className="text-2xl text-white font-semibold">
              <span className="text-yellow-500">
                {ticket?.client.fantasyName}
              </span>
              : {ticket?.title}
            </span>

            <Button
              onClick={() => router.push('/support')}
              className="rounded-full bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 font-bold"
            >
              Cancelar
            </Button>
          </header>

          <form
            action=""
            onSubmit={updateForm.handleSubmit(handleUpdateSupportFormSubmit)}
            className="flex justify-between items-center bg-gray-500/40 rounded-lg py-3 px-4 flex-wrap gap-6 text-gray-300"
          >
            <Select
              id="status"
              label="Status"
              disabled={!!user?.clientId}
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
              defaultSelectedKeys={ticket && [ticket?.status]}
              {...updateForm.register('status')}
            >
              {status.map((status) => (
                <SelectItem key={status}>
                  {status === 'NaoIniciado' ? 'Não Iniciado' : status}
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
              defaultSelectedKeys={ticket && [ticket?.priority]}
              {...updateForm.register('priority')}
            >
              {priorities.map((priority) => (
                <SelectItem key={priority}>{priority}</SelectItem>
              ))}
            </Select>

            <Input
              id="endDate"
              label="Data de vencimento"
              type="date"
              disabled={!!user?.clientId}
              placeholder=" "
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...updateForm.register('endDate')}
            />

            <Input
              id="client"
              label="Cliente"
              disabled
              placeholder={id && ' '}
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              value={ticket?.client.fantasyName}
            />

            <Select
              id="helperTopic"
              label="Tópico de ajuda"
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
              defaultSelectedKeys={ticket && [ticket?.helperTopic]}
              {...updateForm.register('helper')}
            >
              {helpers.map((helper) => (
                <SelectItem key={helper}>{helper}</SelectItem>
              ))}
            </Select>

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
              defaultSelectedKeys={ticket && [ticket?.collaborator.id]}
              {...updateForm.register('collaboratorId')}
            >
              {collaborators.map((collaborator) => (
                <SelectItem key={collaborator.id}>
                  {collaborator.name + ' ' + collaborator.lastName}
                </SelectItem>
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
              defaultSelectedKeys={ticket && [ticket?.project.id]}
              {...updateForm.register('projectId')}
            >
              {projects.map((project, index) => (
                <SelectItem key={project.id || index}>
                  {project.name}
                </SelectItem>
              ))}
            </Select>

            <Button
              type="submit"
              className="disabled:border-none items-center disabled:transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 text-gray-700 bg-yellow-500 font-bold hover:bg-yellow-600"
            >
              Atualizar
            </Button>
          </form>

          <section className="space-y-6">
            <span className="text-xl font-bold text-white">Conversa</span>
            {messages &&
              messages.map((message) => (
                <>
                  {message.user.id === user?.userId ? (
                    <section
                      className="flex gap-2 w-full justify-end"
                      key={message.id}
                    >
                      <div className="flex items-end flex-col gap-2 text-sm max-w-4xl">
                        <span>
                          <span className="font-medium text-yellow-500">
                            {message.user.collaborator
                              ? message.user.collaborator.name +
                                ' ' +
                                message.user.collaborator.lastName
                              : message.user.client.fantasyName}{' '}
                          </span>
                        </span>
                        <span className="flex bg-gray-500 py-3 px-4 rounded-lg gap-4 flex-col">
                          <HTMLRenderer htmlString={message.message} />
                          <span className="text-xs text-gray-300/80 italic">
                            Enviado{' '}
                            {format(new Date(message.createdAt), 'dd/LL/yyyy')}{' '}
                            às {format(new Date(message.createdAt), 'HH:mm')}
                          </span>
                        </span>
                      </div>

                      <Avatar
                        className="min-w-[40px]"
                        imgProps={{
                          loading: 'eager',
                        }}
                      />
                    </section>
                  ) : (
                    <section className="flex gap-2" key={message.id}>
                      <Avatar
                        className="min-w-[40px]"
                        imgProps={{
                          loading: 'eager',
                        }}
                      />
                      <div className="flex flex-col gap-2 text-sm  max-w-4xl">
                        <span>
                          <span className="font-medium text-yellow-500">
                            {message.user.collaborator
                              ? message.user.collaborator.name +
                                ' ' +
                                message.user.collaborator.lastName
                              : message.user.client.fantasyName}{' '}
                          </span>
                        </span>
                        <span className="flex bg-gray-700 py-3 px-4 rounded-lg gap-4 flex-col">
                          <HTMLRenderer htmlString={message.message} />
                          <span className="text-xs text-gray-300 italic">
                            Enviado{' '}
                            {format(new Date(message.createdAt), 'dd/LL/yyyy')}{' '}
                            às {format(new Date(message.createdAt), 'HH:mm')}
                          </span>
                        </span>
                      </div>
                    </section>
                  )}
                </>
              ))}
          </section>

          <section className="space-y-6">
            <span className="text-xl font-bold text-white">Responder</span>
            <form
              action=""
              onSubmit={handleSubmit(handleSupportFormSubmit)}
              className="max-w-7xl w-full space-y-6 flex flex-col items-end"
            >
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

              <Button
                type="submit"
                className="disabled:border-none items-center disabled:transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-lg px-6 py-4 text-gray-700 bg-yellow-500 font-bold hover:bg-yellow-600"
              >
                Enviar mensagem
              </Button>
            </form>
          </section>
        </main>
      )}
      {showToast && <Toast message="Chamado atualizado com sucesso" />}
    </div>
  )
}
