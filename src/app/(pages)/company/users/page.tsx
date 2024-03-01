'use client'

import { Eye, EyeOff, Save } from 'lucide-react'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Collaborator } from '@/types/collaborator'
import { useRouter, useSearchParams } from 'next/navigation'
import { User } from '@/types/user'
import { useUser } from '@/app/contexts/useUser'
import { toast } from 'sonner'
import {
  createCollaboratorUser,
  getCollaboratorsWithNoAccess,
  sendNewUserEmail,
  updateCollaboratorUser,
} from '@/functions/requests'
import Loading from '@/components/Loading'

const createCollaboratorUserSchema = z.object({
  collaboratorId: z.string().uuid('Selecione um colaborador'),
  email: z.string().email('Insira um email'),
  password: z.string().min(1, 'Insira a senha'),
})

export type CreateCollaboratorUserSchema = z.infer<
  typeof createCollaboratorUserSchema
>

export default function Users() {
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [user, setUser] = useState<User>()
  const searchParams = useSearchParams()
  const params = Array.from(searchParams.values())
  const id = params[0]
  const router = useRouter()
  const { auth } = useUser()

  useEffect(() => {
    async function fetchData() {
      const response = await getCollaboratorsWithNoAccess(auth?.token)
      setCollaborators(response)
    }

    fetchData()
  }, [auth?.token])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCollaboratorUserSchema>({
    resolver: zodResolver(createCollaboratorUserSchema),
    defaultValues: async () =>
      id &&
      (await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/find/user`, {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
            id,
          },
        })
        .then((response) => {
          setUser(response.data)
          return response.data
        })
        .catch(function (error) {
          console.error(error)
        })),
  })

  const handleChangePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible)
  }

  const handleCreateUserFormSubmit: SubmitHandler<
    CreateCollaboratorUserSchema
  > = async (data: CreateCollaboratorUserSchema) => {
    if (typeof window !== 'undefined') {
      if (!user) {
        const body = {
          collaboratorId: data.collaboratorId,
          email: data.email,
          password: data.password,
        }

        try {
          await createCollaboratorUser(auth?.token, body)
          await sendNewUserEmail(auth?.token, body)
          toast.success('Usuário criado com successo!')

          router.push('/company')
        } catch (error) {
          console.error('Erro ao buscar os dados:', error)
          toast.error('Erro ao tentar criar usuário')
        }
      }

      if (user) {
        const body = {
          userId: id,
          email: data.email,
          password: data.password,
        }

        try {
          await updateCollaboratorUser(auth?.token, body)
          toast.success('Usuário atualizado com successo!')

          router.push('/company')
        } catch (error) {
          console.error('Erro ao buscar os dados:', error)
          toast.error('Erro ao tentar atualizar usuário')
        }
      }
    }
  }

  if (id && !user) {
    return <Loading />
  }

  return (
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
            onClick={() => router.push('/company')}
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
          id="collaboratorId"
          label="Colaborador"
          classNames={{
            trigger: [
              user
                ? 'bg-gray-700 cursor-not-allowed data-[hover=true]:bg-gray-600 rounded-lg'
                : 'bg-gray-700 data-[hover=true]:bg-gray-600 rounded-lg',
            ],
            listboxWrapper: 'max-h-[400px] rounded-lg',
            popover: 'bg-gray-700 rounded-lg',
            base: 'max-w-sm',
          }}
          listboxProps={{
            itemClasses: {
              base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
            },
          }}
          {...register('collaboratorId')}
          errorMessage={errors.collaboratorId?.message}
          defaultSelectedKeys={
            collaborators.length === 0 && !user
              ? ['no-collaborators']
              : user
              ? ['user']
              : undefined
          }
          isDisabled={!!(collaborators.length === 0 || user)}
          isInvalid={!!errors.collaboratorId}
        >
          {collaborators.length === 0 && !id ? (
            <SelectItem key={'no-collaborators'} aria-disabled>
              Nenhum colaborador sem acesso ao sistema
            </SelectItem>
          ) : user ? (
            <SelectItem key={'user'}>
              {user.name + ' ' + user.lastName}
            </SelectItem>
          ) : (
            collaborators.map((collaborator) => (
              <SelectItem key={collaborator.id}>
                {collaborator.name + ' ' + collaborator.lastName}
              </SelectItem>
            ))
          )}
        </Select>

        <Input
          id="email"
          label="E-mail"
          placeholder={id && ' '}
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

        {!id && (
          <Input
            id="password"
            label="Senha"
            placeholder={id && ' '}
            classNames={{
              label: 'text-gray-300',
              base: 'max-w-sm',
              inputWrapper:
                'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
            }}
            {...register('password')}
            type={isPasswordVisible ? 'text' : 'password'}
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
            endContent={
              isPasswordVisible ? (
                <Eye
                  className="text-gray-300 cursor-pointer"
                  size={20}
                  onClick={handleChangePasswordVisibility}
                />
              ) : (
                <EyeOff
                  className="text-gray-300 cursor-pointer"
                  size={20}
                  onClick={handleChangePasswordVisibility}
                />
              )
            }
          />
        )}
      </section>
    </form>
  )
}
