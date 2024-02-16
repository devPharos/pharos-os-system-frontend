'use client'

import { Save } from 'lucide-react'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Client } from '@/types/client'
import { useUser } from '@/app/contexts/useUser'
import { toast } from 'sonner'
import { createClientUser, sendNewUserEmail } from '@/functions/requests'

const createUserSchema = z.object({
  clientId: z.string().uuid('Selecione um cliente'),
  email: z.string().email('Insira um email'),
  password: z.string().min(8, 'A senha deve conter no mínimo 8 caracteres'),
})

export type CreateUserSchema = z.infer<typeof createUserSchema>

export default function Users() {
  const [clients, setClients] = useState<Client[]>([])
  const { auth } = useUser()
  const router = useRouter()

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        })
        .then((response) => {
          setClients(response.data)
        })
    }
  }, [auth.token])

  const handleCreateUserFormSubmit: SubmitHandler<CreateUserSchema> = async (
    data: CreateUserSchema,
  ) => {
    if (typeof window !== 'undefined') {
      const body = {
        clientId: data.clientId,
        email: data.email,
        password: data.password,
      }

      try {
        await createClientUser(auth?.token, body)
        await sendNewUserEmail(auth?.token, body)
        toast.success('Usuário criado com successo!')

        router.push('/clients')
      } catch (error) {
        console.error('Erro ao buscar os dados:', error)

        toast.error('Erro ao tentar criar usuário')
        setError('email', {
          message: 'Já existe um usuário cadastrado com esse e-mail',
        })
      }
    }
  }

  return (
    <>
      <div className="flex flex-col items-center w-full gap-2 pb-6">
        <form
          onSubmit={handleSubmit(handleCreateUserFormSubmit)}
          className="max-w-7xl w-full space-y-10 px-6"
        >
          <header className={'flex items-center justify-between'}>
            <span className="text-2xl font-bold text-white">
              Criação de Usuário
            </span>

            <section className="flex items-center gap-6">
              <Button
                className="rounded-full bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 font-bold"
                onClick={() => router.push('/clients')}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                className="disabled:border-none items-center disabled:transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 text-gray-700 bg-yellow-500 font-bold hover:bg-yellow-600"
              >
                <Save size={16} />
                Salvar usuário
              </Button>
            </section>
          </header>

          <section className="flex flex-wrap gap-6">
            <Select
              id="clientId"
              label="Cliente"
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
              {...register('clientId')}
              errorMessage={errors.clientId?.message}
              isInvalid={!!errors.clientId}
            >
              {clients.map((client) => (
                <SelectItem key={client.id}>{client.fantasyName}</SelectItem>
              ))}
            </Select>

            <Input
              id="email"
              label="E-mail"
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('email')}
              errorMessage={errors.email?.message}
              isInvalid={!!errors.email}
            />

            <Input
              id="password"
              label="Senha"
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('password')}
              errorMessage={errors.password?.message}
              isInvalid={!!errors.password}
            />
          </section>
        </form>
      </div>
    </>
  )
}
