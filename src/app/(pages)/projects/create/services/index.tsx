'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Checkbox, Input } from '@nextui-org/react'
import { Save } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { ServiceOpened } from '@/app/hooks/useProjects'
import { Dispatch, SetStateAction } from 'react'

const projectServicesFormSchema = z.object({
  description: z.string().min(1, 'Insira a descrição da despesa'),
  chargesClient: z.boolean().default(false),
  passCollaborator: z.boolean().default(false),
})

export type ProjectServicesFormSchema = z.infer<
  typeof projectServicesFormSchema
>

export interface ProjectServices extends ProjectServicesFormSchema {
  id?: string
  deleted?: boolean
}

interface ProjectServicesFormProps {
  handleCreateProjectService: (service: ProjectServices, index?: number) => void
  serviceOpened: ServiceOpened | undefined
  setOpenService: Dispatch<SetStateAction<boolean>>
}

export default function ProjectServicesForm({
  handleCreateProjectService,
  serviceOpened,
  setOpenService,
}: ProjectServicesFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProjectServicesFormSchema>({
    resolver: zodResolver(projectServicesFormSchema),
    values: {
      chargesClient: serviceOpened?.chargesClient ?? false,
      description: serviceOpened?.description ?? '',
      passCollaborator: serviceOpened?.passCollaborator ?? false,
    },
  })

  async function handleProjectServiceSubmit({
    chargesClient,
    description,
    passCollaborator,
  }: ProjectServicesFormSchema) {
    handleCreateProjectService(
      {
        id: serviceOpened?.id,
        chargesClient,
        description,
        passCollaborator,
      },
      serviceOpened?.index,
    )

    toast.success('Serviço criado com sucesso!')
    handleClearForm()
  }

  function handleClearForm() {
    reset({
      chargesClient: false,
      description: '',
      passCollaborator: false,
    })
    setOpenService(false)
  }

  return (
    <main className="w-full">
      <form
        onSubmit={handleSubmit(handleProjectServiceSubmit)}
        className="flex flex-col gap-8"
      >
        <header className={'flex items-center justify-between'}>
          <span className="text-2xl font-bold text-white">
            Adicionar serviço
          </span>

          <section className="flex items-center gap-6">
            <Button
              className="rounded-full bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 font-bold"
              onClick={handleClearForm}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="disabled:border-none items-center disabled:transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 text-gray-700 bg-gray-100 font-bold hover:bg-gray-200"
            >
              <Save size={16} />
              Salvar serviço
            </Button>
          </section>
        </header>

        <section className="flex flex-wrap gap-6">
          <Input
            id="description"
            label="Descrição do serviço"
            classNames={{
              label: 'text-gray-300',
              base: 'max-w-sm',
              inputWrapper:
                'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
            }}
            {...register('description')}
            errorMessage={errors.description?.message}
            isInvalid={!!errors.description}
            placeholder={serviceOpened && ' '}
          />

          <Controller
            control={control}
            name="chargesClient"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                radius="sm"
                onChange={onChange}
                isSelected={value}
                classNames={{
                  wrapper: 'data-[selected=true]:bg-yellow-500',
                  label: 'text-gray-100',
                }}
              >
                Cobra do cliente
              </Checkbox>
            )}
          />

          <Controller
            control={control}
            name="passCollaborator"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                radius="sm"
                onChange={onChange}
                isSelected={value}
                classNames={{
                  wrapper: 'data-[selected=true]:bg-yellow-500',
                  label: 'text-gray-100',
                }}
              >
                Repassa para o colaborador
              </Checkbox>
            )}
          />
        </section>
      </form>
    </main>
  )
}
