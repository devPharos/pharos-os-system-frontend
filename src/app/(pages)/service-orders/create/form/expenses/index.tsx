'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import { DollarSign, FileUp, Save } from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ProjectExpenses, ServiceOrderExpenses } from '@/types/service-order'
import { useRegister } from '@/hooks/useRegister'

interface OSExpensesProps {
  projectId: string
  handleExpenseSave: (expense: ProjectExpenses) => void
  expense?: ProjectExpenses
  osExpenses?: ServiceOrderExpenses
}

export default function CreateOSExpenses({
  projectId,
  handleExpenseSave,
  expense,
  osExpenses,
}: OSExpensesProps) {
  const { token } = useRegister()
  const [loading, setLoading] = useState(false)
  const [projectExpenses, setProjectExpenses] = useState<ProjectExpenses[]>([])
  const [projectExpense, setProjectExpense] = useState<ProjectExpenses>()

  const osExpensesFormSchema = z.object({
    projectExpenseId: z.string().uuid('Selecione um tipo de reembolso'),
    value: z.string().min(1, 'Insira o valor do reembolso'),
  })

  type TOsExpensesFormData = z.infer<typeof osExpensesFormSchema>

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<TOsExpensesFormData>({
    resolver: zodResolver(osExpensesFormSchema),
    defaultValues: {
      projectExpenseId: expense?.id,
      value: expense?.value,
    },
  })

  const handleOSExpensesFormSubmit: SubmitHandler<TOsExpensesFormData> = (
    data: TOsExpensesFormData,
  ) => {
    const exp = projectExpenses.find((exp) => exp.id === data.projectExpenseId)

    const isValueCorrect = projectExpense
      ? data.value.replace(/\D/g, '') <= projectExpense?.value
      : data.value.replace(/\D/g, '') <= (expense?.value || '')

    if (!isValueCorrect) {
      setError('value', {
        message: `Insira um valor até ${projectExpense?.value}`,
      })
    }

    if (isValueCorrect) {
      const expense: ProjectExpenses = {
        ...data,
        id: data.projectExpenseId,
        description: exp?.description || '',
        serviceOrderExpenseId: osExpenses?.id,
      }

      handleExpenseSave(expense)
      reset()
    }
  }

  useEffect(() => {
    setLoading(true)
    const body = {
      projectId,
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/project-expenses`, {
        data: {
          body,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false)
        setProjectExpenses(response.data.projectExpenses)
      })
  }, [projectId, token])

  const handleSelectProject = (selectedKey: any) => {
    setLoading(true)
    const selectedExpenseId = selectedKey.currentKey

    const expense = projectExpenses.find(
      (expense) => expense.id === selectedExpenseId,
    )

    if (expense) {
      setProjectExpense(expense)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleOSExpensesFormSubmit)}
      className="max-w-7xl w-full space-y-10 px-6"
    >
      <section className={'flex flex-col gap-6'}>
        <header className={'flex items-center justify-between'}>
          <span className="text-xl font-bold text-white">Despesas</span>

          <section className="flex items-center gap-6">
            <Button
              type="submit"
              className="rounded-full px-6 py-4 hover:text-gray-700 text-yellow-500 font-bold bg-transparent border-2 border-dashed border-yellow-500 hover:bg-yellow-500"
            >
              <Save size={16} />
              Salvar despesa
            </Button>
          </section>
        </header>

        <section className={'flex items-center gap-6'}>
          <Select
            id="projectExpenseId"
            label="Tipo de reembolso"
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
            {...register('projectExpenseId')}
            errorMessage={errors.projectExpenseId?.message}
            validationState={errors.projectExpenseId && 'invalid'}
            onSelectionChange={(keys) => handleSelectProject(keys)}
            defaultSelectedKeys={expense ? [expense?.id || ''] : []}
          >
            {projectExpenses?.map((project) => {
              return (
                <SelectItem key={project.id} value={project.id}>
                  {project.description}
                </SelectItem>
              )
            })}
          </Select>
          <Input
            label="Reembolso"
            id="value"
            classNames={{
              label: 'text-gray-300',
              inputWrapper:
                'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
            }}
            {...register('value')}
            placeholder={projectExpense?.value || expense?.value}
            errorMessage={errors.value?.message}
            validationState={errors.value && 'invalid'}
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
      </section>
    </form>
  )
}
