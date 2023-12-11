'use client'
import { Card } from '@/components/Card'
import HTMLRenderer from '@/components/HTMLRenderer'
import TipTap from '@/components/TipTap'
import { getUserData } from '@/hooks/useRegister'
import Header from '@/layouts/header'
import { SupportTicketMessage, Ticket } from '@/types/support'
import { UserData } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Input,
  Select,
  SelectItem,
} from '@nextui-org/react'
import axios from 'axios'
import {
  PlusCircle,
  AlertCircle,
  GaugeCircle,
  ArrowRightCircle,
  CheckCircle2,
  Eraser,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Save,
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

export default function SupportTicket() {
  const [user, setUser] = useState<UserData>()
  const [messages, setMessages] = useState<SupportTicketMessage[]>([])
  const searchParams = useSearchParams()
  const params = Array.from(searchParams.values())
  const [ticket, setTicket] = useState<Ticket>()
  const id = params[0]

  const supportFormSchema = z.object({
    message: z.string().min(1, 'Descreva o problema'),
  })

  type SupportFormSchema = z.infer<typeof supportFormSchema>

  const {
    reset,
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
        userId: user?.userId,
        supportId: id,
      }
      axios
        .post('http://localhost:3333/ticket/message', body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setMessages(response.data)
          reset()
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
        .get('http://localhost:3333/ticket', {
          headers: {
            Authorization: `Bearer ${token}`,
            id,
          },
        })
        .then((response) => {
          setMessages(response.data.SupportMessage)
          setTicket(response.data)
        })
    }
  }, [id])

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <main className="flex flex-col gap-16 max-w-7xl w-full px-6 py-14">
        <header>
          <span className="text-2xl text-white font-semibold">
            <span className="text-yellow-500">Pharos OS System</span>: Erro no
            arquivo
          </span>
        </header>

        <section className="flex items-center bg-gray-500/40 rounded-lg py-3 px-4 flex-wrap gap-6 text-gray-300">
          <Select
            id="collaboratorId"
            label="Colaborador"
            classNames={{
              trigger: 'bg-gray-700  data-[hover=true]:bg-gray-600 rounded-lg',
              listboxWrapper: 'max-h-[400px] rounded-lg',
              popover: 'bg-gray-700 rounded-lg ',
              base: 'max-w-sm',
            }}
            listboxProps={{
              itemClasses: {
                base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
              },
            }}
            // {...register('collaboratorId')}
            //  errorMessage={errors.collaboratorId?.message}
            //  validationState={errors.collaboratorId && 'invalid'}
          >
            <SelectItem key={'0'}>Teste</SelectItem>
          </Select>

          <Select
            id="collaboratorId"
            label="Status"
            classNames={{
              trigger: 'bg-gray-700  data-[hover=true]:bg-gray-600 rounded-lg',
              listboxWrapper: 'max-h-[400px] rounded-lg',
              popover: 'bg-gray-700 rounded-lg ',
              base: 'max-w-sm',
            }}
            listboxProps={{
              itemClasses: {
                base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
              },
            }}
            // {...register('collaboratorId')}
            //  errorMessage={errors.collaboratorId?.message}
            //  validationState={errors.collaboratorId && 'invalid'}
          >
            <SelectItem key={'0'}>Teste</SelectItem>
          </Select>

          <Select
            id="collaboratorId"
            label="Prioridade"
            classNames={{
              trigger: 'bg-gray-700  data-[hover=true]:bg-gray-600 rounded-lg',
              listboxWrapper: 'max-h-[400px] rounded-lg',
              popover: 'bg-gray-700 rounded-lg ',
              base: 'max-w-sm',
            }}
            listboxProps={{
              itemClasses: {
                base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
              },
            }}
            // {...register('collaboratorId')}
            //  errorMessage={errors.collaboratorId?.message}
            //  validationState={errors.collaboratorId && 'invalid'}
          >
            <SelectItem key={'0'}>Teste</SelectItem>
          </Select>

          <Input
            id="businessName"
            label="Data de vencimento"
            disabled
            placeholder={id && ' '}
            classNames={{
              label: 'text-gray-300',
              base: 'max-w-sm',
              inputWrapper:
                'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
            }}
          />

          <Input
            id="businessName"
            label="Cliente"
            disabled
            placeholder={id && ' '}
            classNames={{
              label: 'text-gray-300',
              base: 'max-w-sm',
              inputWrapper:
                'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
            }}
          />
        </section>

        <section className="space-y-6">
          {messages &&
            messages.map((message) => (
              <>
                {message.user.id === user?.userId ? (
                  <section className="flex gap-2 w-full justify-end">
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
                      <span className="bg-gray-400 py-3 px-4 rounded-lg">
                        <HTMLRenderer htmlString={message.message} />
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
                  <section className="flex gap-2">
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
                      <span className="bg-gray-700 py-3 px-4 rounded-lg">
                        <HTMLRenderer htmlString={message.message} />
                      </span>
                    </div>
                  </section>
                )}
              </>
            ))}
        </section>

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
      </main>
    </div>
  )
}
