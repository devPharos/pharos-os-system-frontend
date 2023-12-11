import { Card } from '@/components/Card'
import { ProjectExpenses } from '@/types/projects'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Checkbox, Input, Select } from '@nextui-org/react'
import axios from 'axios'
import { Save, Trash2 } from 'lucide-react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

interface ProjectExpensesFormProps {
  handleNewProjectExpense: (expense: Partial<ProjectExpenses>) => void
}

export default function ProjectExpensesForm({
  handleNewProjectExpense,
}: ProjectExpensesFormProps) {
  const projectExpensesFormSchema = z.object({
    description: z.string().min(1, 'Insira a descrição da despesa'),
    value: z.string().min(1, 'Insira o valor máximo da despesa'),
    requireReceipt: z.boolean().default(false),
  })

  type ProjectExpensesFormSchema = z.infer<typeof projectExpensesFormSchema>

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectExpensesFormSchema>({
    resolver: zodResolver(projectExpensesFormSchema),
    // defaultValues: async () =>
    //   id &&
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

  const handleProjectExpensesFormSubmit: SubmitHandler<
    ProjectExpensesFormSchema
  > = (data: ProjectExpensesFormSchema) => {
    if (window !== undefined) {
      handleNewProjectExpense(data)
      reset()
    }
  }

  return (
    <div className="max-w-7xl flex flex-col items-center gap-14 w-full">
      <div className="flex flex-col items-center w-full gap-2 pb-6">
        <section className="flex  px-6 flex-wrap w-full items-center gap-6">
          <form
            onSubmit={handleSubmit(handleProjectExpensesFormSubmit)}
            className="w-full space-y-10"
          >
            <header className={'flex items-center w-full justify-between'}>
              <span className="text-2xl font-bold text-white">
                Cadastro de Despesa
              </span>

              <section className="flex items-center gap-6">
                <Button
                  // disabled={loading}
                  type="submit"
                  className="disabled:border-none items-center disabled:transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 border-2 border-dashed border-yellow-500 text-yellow-500 hover:text-gray-700 bg-transparent font-bold hover:bg-yellow-500"
                >
                  <Save size={16} />
                  Salvar despesa
                </Button>
              </section>
            </header>

            <section className="flex flex-wrap w-full gap-6">
              <Input
                id="description"
                label="Descrição de despesa"
                classNames={{
                  label: 'text-gray-300',
                  base: 'max-w-sm',
                  inputWrapper:
                    'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
                }}
                {...register('description')}
                errorMessage={errors.description?.message}
                validationState={errors.description && 'invalid'}
                // placeholder={id && ' '}
              />

              <Input
                id="value"
                label="Valor"
                classNames={{
                  label: 'text-gray-300',
                  base: 'max-w-sm',
                  inputWrapper:
                    'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
                }}
                {...register('value')}
                errorMessage={errors.value?.message}
                validationState={errors.value && 'invalid'}
                // placeholder={id && ' '}
              />

              <Controller
                control={control}
                name="requireReceipt"
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
                    Exige nota fiscal
                  </Checkbox>
                )}
              />
            </section>
          </form>
        </section>
      </div>
    </div>
  )
}
