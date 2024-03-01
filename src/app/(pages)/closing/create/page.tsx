'use client'

import { useUser } from '@/app/contexts/useUser'
import Loading from '@/components/Loading'
import { handleCreateClosingPdf } from '@/functions/auxiliar'
import Header from '@/layouts/header'
import { Client } from '@/types/client'
import { Project } from '@/types/projects'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Chip,
  Input,
  Select,
  SelectItem,
} from '@nextui-org/react'
import axios from 'axios'
import { ArrowRightCircle, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const createMonthlyClosingSchema = z.object({
  clientId: z.string().uuid(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
})

export type CreateMonthlyClosingSchema = z.infer<
  typeof createMonthlyClosingSchema
>

export default function CreateMonthlyClosing() {
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const { auth } = useUser()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateMonthlyClosingSchema>({
    resolver: zodResolver(createMonthlyClosingSchema),
  })

  useEffect(() => {
    if (auth?.token) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        })
        .then((response) => {
          setClients(response.data)
          setLoading(false)
        })
        .catch((error) => {
          if (error) {
            setLoading(false)
            toast.error('Erro ao tentar carregar os clientes')
          }
        })
    }
  }, [auth?.token])

  const handleGetClientProjects = (keys: any) => {
    if (auth?.token) {
      const clientId = keys.currentKey

      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
            clientid: clientId,
          },
        })
        .then((response) => {
          const allProjects: Project[] = response.data.projects

          const openProjects: Project[] = allProjects.filter(
            (project) =>
              project.status === 'Iniciado' || project.status === 'Finalizado',
          )

          setProjects(openProjects)
        })
        .catch((error) => {
          if (error) {
            console.log(error)
            toast.error('Erro ao tentar carregar os projetos')
          }
        })
    }
  }

  const handleSubmitNewMonthlyClosing: SubmitHandler<
    CreateMonthlyClosingSchema
  > = (data: CreateMonthlyClosingSchema) => {
    const selectedProjects: string[] = selected.filter(
      (select) => select !== '',
    )
    const body = {
      ...data,
      selectedProjects,
    }

    if (selectedProjects.length === 0) {
      toast.error('Selecione ao menos um projeto')

      return
    }

    if (auth?.token) {
      handleCreateClosingPdf(body, auth?.token)
    }
  }

  return (
    <form
      id="closing"
      onSubmit={handleSubmit(handleSubmitNewMonthlyClosing)}
      action=""
      className="max-w-7xl w-full space-y-10 px-6"
    >
      <header className="flex items-center justify-between">
        <section className="flex flex-col">
          <span className="font-bold text-2xl text-white">
            Criação de fechamento
          </span>
        </section>

        <section className="space-x-6">
          <Button
            className="rounded-full bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 font-bold"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>

          <Button
            className="rounded-full px-6 py-4 text-gray-700 font-bold bg-yellow-500 hover:bg-yellow-600"
            type="submit"
            form="closing"
          >
            <Save size={18} className="text-gray-700" />
            Salvar fechamento
          </Button>
        </section>
      </header>

      <section className="w-full flex gap-6 flex-wrap">
        <Select
          id="clientId"
          label="Cliente"
          classNames={{
            trigger: 'bg-gray-700 data-[hover=true]:bg-gray-600 rounded-lg',
            listboxWrapper: 'max-h-[400px] rounded-lg',
            popover: 'bg-gray-700 rounded-lg',
            base: 'min-w-fit max-w-sm',
          }}
          listboxProps={{
            itemClasses: {
              base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
            },
          }}
          onSelectionChange={(keys) => handleGetClientProjects(keys)}
          {...register('clientId')}
          errorMessage={errors.clientId?.message}
        >
          {clients &&
            clients.map((client) => {
              return (
                <SelectItem key={client.id}>{client.fantasyName}</SelectItem>
              )
            })}
        </Select>

        <Input
          id="startDate"
          type="date"
          label="Início do período"
          placeholder=" "
          classNames={{
            label: 'text-gray-300 font-normal',
            inputWrapper:
              'bg-gray-700 rounded-lg text-gray-100 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 color-scheme:dark',
            input: '[color-scheme]:dark',
            base: 'min-w-fit max-w-sm',
          }}
          {...register('startDate')}
          errorMessage={errors.startDate?.message}
        />

        <Input
          id="endDate"
          type="date"
          label="Fim do período"
          placeholder=" "
          classNames={{
            label: 'text-gray-300 font-normal',
            inputWrapper:
              'bg-gray-700 rounded-lg text-gray-100 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 color-scheme:dark',
            input: '[color-scheme]:dark',
            base: 'min-w-fit max-w-sm',
          }}
          {...register('endDate')}
          errorMessage={errors.endDate?.message}
        />

        {projects && (
          <>
            {projects.length === 0 ? (
              <section>
                <span className="text-gray-300">
                  O cliente selecionado não tem nenhum projeto em andamento.
                </span>
              </section>
            ) : (
              <CheckboxGroup
                label="Selecione os projetos"
                classNames={{
                  label: 'text-gray-100 mb-6',
                  base: 'gap-2',
                  wrapper: 'gap-6',
                }}
                orientation="horizontal"
                value={selected}
                onValueChange={setSelected}
              >
                {projects?.map((project) => {
                  return (
                    <Checkbox
                      classNames={{
                        base: [
                          'bg-gray-700 data-[hover=true]:bg-gray-600 rounded-lg gap-2 p-4',
                        ],
                        label: 'w-full text-gray-100',
                        wrapper:
                          'border-gray-300 before:border-gray-300 group-data-[hover=true]:before:bg-gray-500 after:bg-gray-500 text-gray-100',
                      }}
                      isDisabled={!project.hoursToBeBilled}
                      key={project.id}
                      value={project.id}
                    >
                      <div className="w-full flex justify-between gap-14">
                        <div className="flex flex-col">
                          <span className="text-sm">{project.name}</span>
                          {project.hoursToBeBilled ? (
                            <span className="text-sm text-yellow-600">
                              {project.hoursToBeBilled}h a faturar
                            </span>
                          ) : (
                            <span className="text-sm text-yellow-600">
                              sem horas a faturar
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-tiny text-default-500">
                            {project.collaborator && project?.collaborator.name}
                          </span>
                          <Chip
                            classNames={{
                              base: 'text-orange-600 bg-orange-500/10 py-2 px-2 gap-1',
                            }}
                            startContent={<ArrowRightCircle size={15} />}
                            size="sm"
                            variant="flat"
                          >
                            {project.status}
                          </Chip>
                        </div>
                      </div>
                    </Checkbox>
                  )
                })}
              </CheckboxGroup>
            )}
          </>
        )}
      </section>
    </form>
  )
}
