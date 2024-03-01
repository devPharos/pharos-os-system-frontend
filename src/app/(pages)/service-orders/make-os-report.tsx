import { useUser } from '@/app/contexts/useUser'
import { getClients, listProjects } from '@/functions/requests'
import { Client } from '@/types/client'
import { Projects } from '@/types/projects'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
} from '@nextui-org/react'
import axios from 'axios'
import saveAs from 'file-saver'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export interface MakeOsReportProps {
  collaborators: {
    key: string
    label: string
  }[]
}

const serviceOrderReportSchema = z.object({
  clientId: z.optional(z.string().uuid().nullable()),
  collaboratorId: z.optional(z.string().uuid().nullable()),
  projectId: z.optional(z.string().uuid().nullable()),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
})

export type ServiceOrderReportSchema = z.infer<typeof serviceOrderReportSchema>

export function MakeOsReport({ collaborators }: MakeOsReportProps) {
  const { auth } = useUser()
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Projects[]>([])

  useEffect(() => {
    async function fetchData() {
      if (typeof window !== 'undefined' && auth?.token) {
        const clientsList = await getClients(auth?.token)
        setClients(clientsList)

        const projectsList = await listProjects(auth?.token)
        setProjects(projectsList)
      }
    }

    fetchData()
  }, [auth?.token])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ServiceOrderReportSchema>({
    resolver: zodResolver(serviceOrderReportSchema),
  })

  async function MakeReporting(data: ServiceOrderReportSchema) {
    if (typeof window !== 'undefined') {
      const body = {
        ...data,
        startDate: data.startDate === '' ? null : data.startDate,
        endDate: data.endDate === '' ? null : data.endDate,
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/os-report/pdf`,
        body,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        },
      )

      const pdfPath: {
        path: string
        pathName: string
      } = response.data

      const downloadResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/os-report/pdf`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
            fileName: pdfPath.pathName,
          },
          responseType: 'blob',
        },
      )

      const pdfBlob = new Blob([downloadResponse.data], {
        type: 'application/pdf',
      })
      saveAs(pdfBlob, `${pdfPath.pathName}.pdf`)

      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/os-report/pdf`, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
          fileName: pdfPath.pathName,
        },
      })

      toast.success('Relatório baixado')
    }
  }

  const handleServiceOrderReportFormSubmit: SubmitHandler<
    ServiceOrderReportSchema
  > = async (data: ServiceOrderReportSchema) => {
    await MakeReporting(data)
  }

  return (
    <Popover
      placement="bottom"
      classNames={{
        base: ['bg-zinc-800 rounded-lg p-6'],
      }}
      backdrop="opaque"
    >
      <PopoverTrigger>
        <Button className="rounded-lg min-w-fit px-6 py-4 text-gray-200 font-bold bg-zinc-800 hover:bg-zinc-700">
          Baixar relatório
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <main className="flex flex-col gap-6">
          <header>
            <span>Escolha os parâmetros do relatório</span>
          </header>

          <form
            onSubmit={handleSubmit(handleServiceOrderReportFormSubmit)}
            className="flex flex-wrap w-full gap-4 justify-end"
          >
            <Controller
              name="clientId"
              control={control}
              rules={{ required: false }}
              defaultValue={null}
              render={({ field }) => (
                <Select
                  id="clientId"
                  {...field}
                  value={field.value || ''}
                  label="Cliente"
                  classNames={{
                    trigger:
                      'bg-gray-700 data-[hover=true]:bg-gray-600 rounded-lg',
                    listboxWrapper: 'max-h-[400px] rounded-lg',
                    popover: 'bg-gray-700 rounded-lg',
                  }}
                  listboxProps={{
                    itemClasses: {
                      base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
                    },
                  }}
                >
                  {clients.map((client) => (
                    <SelectItem key={client.id}>
                      {client.fantasyName}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />

            <Controller
              name="collaboratorId"
              control={control}
              rules={{ required: false }}
              defaultValue={null}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value || ''}
                  id="collaboratorId"
                  label="Colaborador"
                  classNames={{
                    trigger:
                      'bg-gray-700 data-[hover=true]:bg-gray-600 rounded-lg',
                    listboxWrapper: 'max-h-[400px] rounded-lg',
                    popover: 'bg-gray-700 rounded-lg',
                  }}
                  listboxProps={{
                    itemClasses: {
                      base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
                    },
                  }}
                >
                  {collaborators.map((collaborator) => (
                    <SelectItem key={collaborator.key}>
                      {collaborator.label}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />

            <Controller
              name="projectId"
              control={control}
              defaultValue={null}
              rules={{ required: false }}
              render={({ field }) => (
                <Select
                  label="Projeto"
                  {...field}
                  value={field.value || ''}
                  classNames={{
                    trigger:
                      'bg-gray-700 data-[hover=true]:bg-gray-600 rounded-lg',
                    listboxWrapper: 'max-h-[400px] rounded-lg',
                    popover: 'bg-gray-700 rounded-lg',
                  }}
                  listboxProps={{
                    itemClasses: {
                      base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
                    },
                  }}
                >
                  {projects &&
                    projects.map((project) => (
                      <SelectItem key={project.id}>{project.name}</SelectItem>
                    ))}
                </Select>
              )}
            />

            <Controller
              name="startDate"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  <Input
                    id="startDate"
                    type="date"
                    {...field}
                    label="Data de inicio"
                    placeholder=" "
                    classNames={{
                      label: 'text-gray-300 font-normal',
                      inputWrapper:
                        'bg-gray-700 rounded-lg text-gray-100 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 color-scheme:dark',
                      input: '[color-scheme]:dark',
                    }}
                    isInvalid={!!errors.startDate?.message}
                    {...register('startDate', { required: false })}
                  />
                  {errors.startDate && errors.startDate.message}
                </>
              )}
            />

            <Controller
              name="endDate"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  <Input
                    id="endDate"
                    type="date"
                    {...field}
                    label="Data de término"
                    placeholder=" "
                    classNames={{
                      label: 'text-gray-300 font-normal',
                      inputWrapper:
                        'bg-gray-700 rounded-lg text-gray-100 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 color-scheme:dark',
                      input: '[color-scheme]:dark',
                    }}
                    isInvalid={!!errors.endDate?.message}
                    {...register('endDate', { required: false })}
                  />
                  {errors.endDate && errors.endDate.message}
                </>
              )}
            />

            <Button
              type="submit"
              className="disabled:border-none items-center disabled:transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 text-gray-700 bg-yellow-500 font-bold hover:bg-yellow-600"
            >
              Fazer download
            </Button>
          </form>
        </main>
      </PopoverContent>
    </Popover>
  )
}
