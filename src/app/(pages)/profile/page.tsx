'use client'
import { useUser } from '@/app/contexts/useUser'
import Loading from '@/components/Loading'
import Header from '@/layouts/header'
import { PharosFile } from '@/types/file'
import { Profile } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, Button, Input } from '@nextui-org/react'
import axios from 'axios'
import { Camera, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export default function Profile() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { auth } = useUser()
  const router = useRouter()

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
            Authorization: `Bearer ${auth?.token}`,
          },
        })
        .then((response) => {
          return response.data
        })
        .catch(function (error) {
          console.error(error)
        }),
  })

  const handleUpdateProfile = (
    data: EditProfileFormSchema,
    file?: PharosFile,
  ) => {
    const body = {
      ...data,
      file,
    }

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/profile`, body, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      })
      .then(function () {
        auth.user.url =
          file?.fileUrl +
          '/file/pharosit-miscelaneous/' +
          file?.fileName.replace(/ /g, '%20')

        if (typeof localStorage !== 'undefined') {
          const stateJSON = JSON.stringify(auth)
          localStorage.setItem('@pharosit:auth-1.0.0', stateJSON)
        }

        toast.success('Perfil atualizado com sucesso')

        router.push('/home')
      })
      .catch(function (error) {
        console.error(error)
      })
  }

  const handleUploadFile = async (
    formData: FormData,
    data: EditProfileFormSchema,
  ) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/storage/upload/file`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
            'Content-Type': 'multipart/form-data',
          },
          params: {
            type: 'miscelaneous',
          },
        },
      )
      .then((response) => {
        if (response.data.status === 200 && selectedFile) {
          const avatarImgFileSchema: PharosFile = {
            fileId: response.data.fileId,
            fileName: selectedFile?.name,
            fileSize: selectedFile.size.toString(),
            fileUrl: response.data.downloadUrl,
          }

          handleUpdateProfile(data, avatarImgFileSchema)

          return
        }

        toast.error('Erro ao tentar enviar o arquivo')
      })
  }

  const handleEditProfileFormSubmit: SubmitHandler<EditProfileFormSchema> = (
    data: EditProfileFormSchema,
  ) => {
    if (selectedFile) {
      const formData = new FormData()
      formData.append('file', selectedFile)
      handleUploadFile(formData, data)
    }

    if (!selectedFile) {
      handleUpdateProfile(data)
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files && event.target.files[0]
      const reader = new FileReader()

      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }

      reader.readAsDataURL(file)
      setSelectedFile(file)
    }
  }

  return (
    <main className="max-w-7xl w-full p-6">
      <form
        onSubmit={handleSubmit(handleEditProfileFormSubmit)}
        className="flex flex-col items-end gap-8"
      >
        <label htmlFor="avatar_pic" className="relative m-auto">
          <Avatar
            alt=""
            className="rounded-full w-[100px] h-[100px]"
            src={selectedImage || auth?.user?.url}
          />

          <div className="cursor-pointer z-50 hover:bg-yellow-600 absolute right-0 bottom-0 w-8 h-8 flex rounded-full bg-yellow-500 items-center justify-center">
            <Camera size={20} className="text-gray-500" />
          </div>
        </label>

        <input
          type="file"
          accept=".png,.jpg"
          id="avatar_pic"
          className="sr-only"
          onChange={handleFileChange}
        />

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
  )
}
