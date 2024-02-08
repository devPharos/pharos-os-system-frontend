'use client'

import Header from '@/layouts/header'

import { Eye, EyeOff, Save } from 'lucide-react'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Collaborator } from '@/types/collaborator'
import Toast from '@/components/Toast'
import { useRouter, useSearchParams } from 'next/navigation'
import { User } from '@/types/user'
import { useUser } from '@/app/contexts/useUser'
import { toast } from 'sonner'

export default function Users() {
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false)
  const [collaboratorsId, setCollaboratorsId] = useState<Collaborator[]>([])
  const [showToast, setShowToast] = useState(false)
  const [user, setUser] = useState<User>()
  const searchParams = useSearchParams()
  const params = Array.from(searchParams.values())
  const id = params[0]
  const router = useRouter()
  const { auth } = useUser()

  const createUserSchema = z.object({
    collaboratorId: z.string().uuid('Selecione um colaborador'),
    email: z.string().email('Insira um email'),
    password: z.string().min(1, 'Insira a senha'),
  })

  type CreateUserSchema = z.infer<typeof createUserSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: async () =>
      id &&
      axios
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
        }),
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/collaborators`, {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        })
        .then((response) => {
          setCollaboratorsId(response.data)
        })
    }
  }, [auth?.token])

  const handleChangePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible)
  }

  const handleCreateUserFormSubmit: SubmitHandler<CreateUserSchema> = (
    data: CreateUserSchema,
  ) => {
    if (typeof window !== 'undefined') {
      if (!user) {
        const body = {
          collaboratorId: data.collaboratorId,
          email: data.email,
          password: data.password,
        }
        axios
          .post(`${process.env.NEXT_PUBLIC_API_URL}/accounts/user`, body, {
            headers: {
              Authorization: `Bearer ${auth?.token}`,
            },
          })
          .then(() => {
            setShowToast(true)

            setInterval(() => {
              setShowToast(false)
            }, 3000)

            router.push('/company')
          })
          .catch((error) => {
            console.log(error)
          })
      }

      if (user) {
        const body = {
          userId: id,
          email: data.email,
          password: data.password,
        }
        axios
          .put(`${process.env.NEXT_PUBLIC_API_URL}/update/user`, body, {
            headers: {
              Authorization: `Bearer ${auth?.token}`,
            },
          })
          .then(() => {
            axios
              .post(
                `${process.env.NEXT_PUBLIC_API_URL}/mail/user-created`,
                {
                  email: data.email,
                  password: data.password,
                },
                {
                  headers: {
                    Authorization: `Bearer ${auth.token}`,
                  },
                },
              )
              .then(() => {
                toast.success('Usuário criado com sucesso!')

                router.push('/company')
              })
              .catch((err) => {
                if (err) {
                  toast.error('Um erro inesperado aconteceu!')
                }
              })
          })
          .catch((error) => {
            console.log(error)
          })
      }
    }
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
            // disabled={loading}
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
          validationState={errors.collaboratorId && 'invalid'}
        >
          {collaboratorsId.map((collaborator) => {
            if (user) {
              return (
                <SelectItem key={user?.collaboratorId || ''}>
                  {user?.name + ' ' + user?.lastName}
                </SelectItem>
              )
            }

            return (
              <SelectItem key={collaborator.id}>
                {collaborator.name + ' ' + collaborator.lastName}
              </SelectItem>
            )
          })}
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
          validationState={errors.email && 'invalid'}
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
            validationState={errors.password && 'invalid'}
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
