'use client'
import Toast from '@/components/Toast'
import { useRegister } from '@/hooks/useRegister'
import Header from '@/layouts/header'
import { Profile } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@nextui-org/react'
import axios from 'axios'
import { Camera, Save } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

export default function Profile() {
  const { token } = useRegister()
  const [showToast, setShowToast] = useState(false)

  const editProfileFormSchema = z.object({
    firstName: z.string().min(1, 'Insira seu primeiro nome'),
    lastName: z.string().min(1, 'Insira seu sobrenome'),
    phone: z.string().min(1, 'Insira seu número de telefone'),
    address: z.string().min(1, 'Insira seu endereço'),
    number: z.string().min(1, 'Insira o número do seu endereço'),
    cep: z.string().min(1, 'Insira seu CEP'),
    complement: z.string().min(1, 'Insira o complemento'),
  })

  type EditProfileFormSchema = z.infer<typeof editProfileFormSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormSchema>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: async () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          return response.data
        })
        .catch(function (error) {
          console.error(error)
        }),
  })

  const handleEditProfileFormSubmit: SubmitHandler<EditProfileFormSchema> = (
    data: EditProfileFormSchema,
  ) => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function () {
        setShowToast(true)

        setInterval(() => {
          setShowToast(!showToast)
        }, 3000)
      })
      .catch(function (error) {
        console.error(error)
      })
  }

  return (
    <div className="min-h-screen flex flex-col items-center relative">
      <Header />

      <main className="max-w-7xl w-full p-6">
        <form
          onSubmit={handleSubmit(handleEditProfileFormSubmit)}
          className="flex flex-col items-end gap-8"
        >
          <section className="relative m-auto">
            <Image
              src="https:www.github.com/gitirana.png"
              alt=""
              width={100}
              height={100}
              className="rounded-full"
              quality={100}
            />

            <div className="cursor-pointer hover:bg-yellow-600 absolute right-0 bottom-0 w-8 h-8 flex rounded-full bg-yellow-500 items-center justify-center">
              <Camera size={20} className="text-gray-500" />
            </div>
          </section>

          <section className="w-full flex items-center justify-center gap-6 flex-wrap">
            <Input
              id="firstName"
              label="Primeiro Nome"
              placeholder=" "
              classNames={{
                label: 'text-gray-300 font-normal',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 rounded-lg text-gray-100 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 color-scheme:dark',
                input: '[color-scheme]:dark',
              }}
              {...register('firstName')}
              errorMessage={errors.firstName?.message}
              validationState={errors.firstName && 'invalid'}
            />

            <Input
              id="lastName"
              label="Sobrenome"
              placeholder=" "
              classNames={{
                base: 'max-w-sm',
                label: 'text-gray-300 font-normal',
                inputWrapper:
                  'bg-gray-700 rounded-lg text-gray-100 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 color-scheme:dark',
                input: '[color-scheme]:dark',
              }}
              {...register('lastName')}
              errorMessage={errors.lastName?.message}
              validationState={errors.lastName && 'invalid'}
            />
            <Input
              id="phone"
              label="Telefone"
              placeholder=" "
              classNames={{
                base: 'max-w-sm',
                label: 'text-gray-300 font-normal',
                inputWrapper:
                  'bg-gray-700 rounded-lg text-gray-100 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 color-scheme:dark',
                input: '[color-scheme]:dark',
              }}
              {...register('phone')}
              errorMessage={errors.phone?.message}
              validationState={errors.phone && 'invalid'}
            />

            <Input
              id="address"
              label="Endereço"
              placeholder=" "
              classNames={{
                base: 'max-w-sm',
                label: 'text-gray-300 font-normal',
                inputWrapper:
                  'bg-gray-700 rounded-lg text-gray-100 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 color-scheme:dark',
                input: '[color-scheme]:dark',
              }}
              {...register('address')}
              errorMessage={errors.address?.message}
              validationState={errors.address && 'invalid'}
            />

            <Input
              id="number"
              label="Número"
              placeholder=" "
              classNames={{
                base: 'max-w-[80px]',
                label: 'text-gray-300 font-normal',
                inputWrapper:
                  'bg-gray-700 rounded-lg text-gray-100 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 color-scheme:dark',
                input: '[color-scheme]:dark',
              }}
              {...register('number')}
              errorMessage={errors.number?.message}
              validationState={errors.number && 'invalid'}
            />

            <Input
              id="cep"
              label="CEP"
              placeholder=" "
              classNames={{
                base: 'max-w-[275px]',
                label: 'text-gray-300 font-normal',
                inputWrapper:
                  'bg-gray-700 rounded-lg text-gray-100 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 color-scheme:dark',
                input: '[color-scheme]:dark',
              }}
              {...register('cep')}
              errorMessage={errors.cep?.message}
              validationState={errors.cep && 'invalid'}
            />

            <Input
              id="complement"
              label="Complemento"
              placeholder=" "
              classNames={{
                base: 'max-w-sm',
                label: 'text-gray-300 font-normal',
                inputWrapper:
                  'bg-gray-700 rounded-lg text-gray-100 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 color-scheme:dark',
                input: '[color-scheme]:dark',
              }}
              {...register('complement')}
              errorMessage={errors.complement?.message}
              validationState={errors.complement && 'invalid'}
            />
          </section>

          <Button
            type="submit"
            className="disabled:border-none items-center disabled:transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 text-gray-700 bg-yellow-500 font-bold hover:bg-yellow-600"
            startContent={<Save size={16} />}
          >
            Salvar
          </Button>
        </form>
      </main>

      {showToast && (
        <Toast message="Seus dados foram atualizados com sucesso" />
      )}
    </div>
  )
}
