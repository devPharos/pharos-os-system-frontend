'use client'

import Header from '@/layouts/header'

import { Save } from 'lucide-react'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Collaborator } from '@/types/collaborator'
import Toast from '@/components/Toast'
import { useRouter } from 'next/navigation'

export default function Users() {
  const [collaboratorsId, setCollaboratorsId] = useState<Collaborator[]>([])
  const [showToast, setShowToast] = useState(false)
  const router = useRouter()

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
    // defaultValues: async () =>
    //   axios
    //     .get('http://localhost:3333/client/data', {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         id,
    //       },
    //     })
    //     .then((response) => {
    //       setClient(response.data)
    //       return response.data
    //     })
    //     .catch(function (error) {
    //       console.error(error)
    //     }),
  })

  useEffect(() => {
    if (window !== undefined) {
      const localStorage = window.localStorage
      const token = localStorage.getItem('access_token')

      axios
        .get('http://localhost:3333/collaborators', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setCollaboratorsId(response.data)
        })
    }
  }, [])

  const handleCreateUserFormSubmit: SubmitHandler<CreateUserSchema> = (
    data: CreateUserSchema,
  ) => {
    if (window !== undefined) {
      const localStorage = window.localStorage
      const token = localStorage.getItem('access_token')
      const body = {
        collaboratorId: data.collaboratorId,
        email: data.email,
        password: data.password,
      }

      axios
        .post('http://localhost:3333/accounts/user', body, {
          headers: {
            Authorization: `Bearer ${token}`,
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
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center gap-14">
      <Header />

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
              //  defaultSelectedKeys={client ? [client?.companyId] : []}
            >
              {collaboratorsId.map((collaborator) => (
                <SelectItem key={collaborator.id}>
                  {collaborator.name + ' ' + collaborator.lastName}
                </SelectItem>
              ))}
            </Select>

            <Input
              id="email"
              label="E-mail"
              //  placeholder={id && ' '}
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

            <Input
              id="password"
              label="Senha"
              //  placeholder={id && ' '}
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('password')}
              errorMessage={errors.password?.message}
              validationState={errors.password && 'invalid'}
            />
          </section>
        </form>
      </div>

      {showToast && <Toast message="Usuário criado com sucesso" />}
    </div>
  )
}
