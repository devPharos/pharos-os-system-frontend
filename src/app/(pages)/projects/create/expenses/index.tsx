import { ExpenseOpened } from '@/app/hooks/useProjects'
import { handleFormatCurrency } from '@/functions/auxiliar'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Checkbox, Input } from '@nextui-org/react'
import { Save } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const projectExpensesFormSchema = z.object({
  description: z.string().min(1, 'Insira a descrição da despesa'),
  value: z.string().min(1, 'Insira a descrição da despesa'),
  requireReceipt: z.boolean().default(false),
})

export type ProjectExpensesFormSchema = z.infer<
  typeof projectExpensesFormSchema
>

export interface ProjectExpenses extends ProjectExpensesFormSchema {
  id?: string
  deleted?: boolean
}

interface ProjectExpensesFormProps {
  handleCreateProjectExpense: (expense: ProjectExpenses, index?: number) => void
  expenseOpened: ExpenseOpened | undefined
  setOpenExpense: Dispatch<SetStateAction<boolean>>
}

export default function ProjectExpensesForm({
  handleCreateProjectExpense,
  expenseOpened,
  setOpenExpense,
}: ProjectExpensesFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProjectExpensesFormSchema>({
    resolver: zodResolver(projectExpensesFormSchema),
    values: {
      requireReceipt: expenseOpened?.requireReceipt ?? false,
      description: expenseOpened?.description ?? '',
      value: expenseOpened?.value ?? '',
    },
  })

  async function handleProjectExpensesSubmit({
    description,
    requireReceipt,
    value,
  }: ProjectExpensesFormSchema) {
    handleCreateProjectExpense(
      {
        id: expenseOpened?.id,
        description,
        requireReceipt,
        value,
      },
      expenseOpened?.index,
    )

    toast.success('Despesa criada com sucesso!')
    handleClearForm()
  }

  function handleClearForm() {
    reset({
      requireReceipt: false,
      description: '',
      value: '',
    })

    setOpenExpense(false)
  }

  return (
    <main className="w-full">
      <form
        onSubmit={handleSubmit(handleProjectExpensesSubmit)}
        className="flex flex-col gap-8"
      >
        <header className={'flex items-center justify-between'}>
          <span className="text-2xl font-bold text-white">
            Adicionar despesa
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
              Salvar despesa
            </Button>
          </section>
        </header>

        <section className="flex flex-wrap gap-6">
          <Input
            id="description"
            label="Descrição da despesa"
            classNames={{
              label: 'text-gray-300',
              base: 'max-w-sm',
              inputWrapper:
                'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
            }}
            {...register('description')}
            errorMessage={errors.description?.message}
            isInvalid={!!errors.description}
            placeholder={expenseOpened && ' '}
          />

          <Input
            id="value"
            label="Valor da despesa"
            classNames={{
              label: 'text-gray-300',
              base: 'max-w-sm',
              inputWrapper:
                'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
            }}
            {...register('value')}
            errorMessage={errors.value?.message}
            onChange={handleFormatCurrency}
            isInvalid={!!errors.value}
            placeholder={expenseOpened && ' '}
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
    </main>
  )
}
