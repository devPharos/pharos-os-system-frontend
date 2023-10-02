'use client'

import { getUserData, useRegister } from '@/hooks/useRegister'
import Header from '@/layouts/header'
import { UserData } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import { Calendar, Clock, DollarSign, FileUp, Save, Search } from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Key, useEffect, useState } from 'react'
import axios from 'axios'
import { Client } from '@/types/client'
import { Projects } from '@/types/projects'

export default function CreateOS() {
  const localStorage = window.localStorage
  const token: string = localStorage.getItem('access_token') || ''
  const userData: UserData = getUserData(token)
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [projects, setProjects] = useState<Projects[]>([])

  useEffect(() => {
    setLoading(true)
    axios
      .get('http://localhost:3333/clients', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false)
        setClients(response.data)
      })
  }, [token])

  const handleClientProjects = (selectedKey: any) => {
    setLoading(true)
    const clientId = selectedKey.currentKey
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
  }

  const osFormSchema = z.object({
    serviceType: z.string().nonempty('Selecione uma opção'),
    date: z.coerce.date(),
    clientId: z.string().uuid(),
    // companyId: z.string().uuid(),
    // collaboratorId: z.string().uuid(),
    startDate: z.string(),
    endDate: z.string(),
    // totalHours: z.string(),
    // serviceOrderId: z.string().uuid(),
    projectId: z.string().uuid(),
    // projectExpenseId: z.string().uuid(),
    // fileHours: z.string(),
    // value: z.string(),
    // projectServiceId: z.string().uuid(),
    description: z.string().min(1),
  })

  type TOsFormData = z.infer<typeof osFormSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TOsFormData>({
    resolver: zodResolver(osFormSchema),
  })

  const handleOSFormSubmit: SubmitHandler<TOsFormData> = (
    data: TOsFormData,
  ) => {
    console.log(data)
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <form
        onSubmit={handleSubmit(handleOSFormSubmit)}
        className="max-w-7xl w-full px-6 py-14 space-y-10"
      >
        <header className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">
            Cadastro de Ordem de Serviço
          </span>

          <section className="flex items-center gap-6">
            <Button className="rounded-full border-2 border-dashed bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:border-solid hover:font-bold">
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-full px-6 py-4 text-gray-700 font-bold bg-yellow-500 hover:bg-yellow-600"
            >
              <Save size={16} />
              Salvar OS
            </Button>
          </section>
        </header>

        <section className="flex items-center gap-6">
          <Select
            id="remote"
            label="Atendimento"
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
            {...register('serviceType')}
            errorMessage={errors.serviceType?.message}
            validationState={errors.serviceType && 'invalid'}
          >
            <SelectItem key="Remoto">Remoto</SelectItem>
            <SelectItem key="Presencial">Presencial</SelectItem>
          </Select>

          <Input
            id="date"
            type="date"
            label="Emissão"
            placeholder=" "
            classNames={{
              label: 'text-gray-300 font-normal',
              inputWrapper:
                'bg-gray-700 rounded-lg text-gray-100 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 color-scheme:dark',
              input: '[color-scheme]:dark',
            }}
            {...register('date')}
            errorMessage={errors.date?.message}
            validationState={errors.date && 'invalid'}
          />

          <Select
            id="clientId"
            label="Cliente"
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
            onSelectionChange={(keys) => handleClientProjects(keys)}
            selectorIcon={<Search />}
            {...register('clientId')}
            errorMessage={errors.clientId?.message}
            validationState={errors.clientId && 'invalid'}
          >
            {clients.map((client) => {
              return (
                <SelectItem key={client.id}>{client.fantasyName}</SelectItem>
              )
            })}
          </Select>
        </section>

        <header
          className={
            projects.length > 0 ? 'flex items-center justify-between' : 'hidden'
          }
        >
          <span className="text-2xl font-bold text-white">Detalhamento</span>

          <section className="flex items-center gap-6">
            <Button
              onPress={() => setIsVisible(!isVisible)}
              className="rounded-full px-6 py-4 hover:text-gray-700 text-yellow-500 font-bold bg-transparent border-2 border-dashed border-yellow-500 hover:bg-yellow-500"
            >
              <Save size={16} />
              Adicionar Detalhamento
            </Button>
          </section>
        </header>

        <section className={projects.length > 0 ? 'space-y-6' : 'hidden'}>
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
            >
              {projects?.map((project) => {
                return <SelectItem key={project.id}>{project.name}</SelectItem>
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
          />
        </section>

        <header
          className={
            projects.length > 0 ? 'flex items-center justify-between' : 'hidden'
          }
        >
          <span className="text-2xl font-bold text-white">Despesas</span>

          <section className="flex items-center gap-6">
            {/* <Button
              onPress={() => setIsVisible(!isVisible)}
              className="rounded-full px-6 py-4 hover:text-gray-700 text-yellow-500 font-bold bg-transparent border-2 border-dashed border-yellow-500 hover:bg-yellow-500"
            >
              <Save size={16} />
              Adicionar Despesa
            </Button>  */}
          </section>
        </header>

        <section
          className={projects.length > 0 ? 'flex items-center gap-6' : 'hidden'}
        >
          <Input
            label="Reembolso"
            classNames={{
              label: 'text-gray-300',
              inputWrapper:
                'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
            }}
            endContent={<DollarSign className="text-gray-300" size={20} />}
          />

          <label
            htmlFor="reembolso_arqv"
            className="cursor-pointer text-gray-300 text-wrap text-sm relative w-full inline-flex tap-highlight-transparent shadow-sm px-3 min-h-unit-10 rounded-medium  items-center justify-between gap-0 transition-background motion-reduce:transition-none !duration-150 outline-none focus:z-10 h-14 py-2 bg-gray-700 hover:bg-gray-800 focus:bg-gray-800  focus:ring-yellow-500"
          >
            Anexar nota fiscal
            <FileUp className="text-gray-300" size={20} />
          </label>

          <input type="file" id="reembolso_arqv" className="sr-only" />
        </section>
      </form>
    </div>
  )
}
