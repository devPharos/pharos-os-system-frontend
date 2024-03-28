import { useUser } from '@/app/contexts/useUser'
import Loading from '@/components/Loading'
import { handleFormatCurrency } from '@/functions/auxiliar'
import { getProjectExpenses } from '@/functions/requests'
import { PharosFile } from '@/types/file'
import { ProjectExpenses } from '@/types/projects'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import axios from 'axios'
import { DollarSign, FileUp, Save } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const osExpensesFormSchema = z.object({
  projectExpenseId: z.string().uuid('Selecione um tipo de reembolso'),
  value: z.string().min(1, 'Insira o valor do reembolso'),
})

type TOsExpensesFormData = z.infer<typeof osExpensesFormSchema>

export interface ServiceOrderExpenses extends TOsExpensesFormData {
  id?: string
  deleted?: boolean
  index?: number
  fileId?: string
  file?: PharosFile
}

interface CreateOSExpensesProps {
  projectId: string | undefined
  handleCreateServiceOrderDetailExpense: (
    expense: ServiceOrderExpenses,
    index?: number,
  ) => void
  expenseOpened: ServiceOrderExpenses | undefined
  setExpenseOpened: Dispatch<SetStateAction<ServiceOrderExpenses | undefined>>
  setOpenExpenses: Dispatch<SetStateAction<boolean>>
}

export default function CreateOSExpenses({
  projectId,
  handleCreateServiceOrderDetailExpense,
  expenseOpened,
  setExpenseOpened,
  setOpenExpenses,
}: CreateOSExpensesProps) {
  const searchParams = useSearchParams()
  const params = Array.from(searchParams.values())
  const id = params[0]

  const { auth } = useUser()
  const [projectExpenses, setProjectExpenses] = useState<ProjectExpenses[]>([])
  const [selectedExpense, setSelectedExpense] = useState<ProjectExpenses>()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (projectId) {
        const projectsList = await getProjectExpenses(auth?.token, projectId)
        setProjectExpenses(projectsList)
      }
    }

    fetchData()
  }, [auth?.token, projectId])

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<TOsExpensesFormData>({
    resolver: zodResolver(osExpensesFormSchema),
    values: {
      projectExpenseId: expenseOpened?.projectExpenseId ?? '',
      value: expenseOpened?.value ?? '',
    },
  })

  function handleFindProjectExpense(selectedKey: any) {
    const projectExpenseId = selectedKey?.currentKey
    const foundedProjectExpense = projectExpenses.find(
      (expense) => expense.id === projectExpenseId,
    )

    setSelectedExpense(foundedProjectExpense)
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files && event.target.files[0]
      setSelectedFile(file)
    }
  }

  const handleUploadFile = async (
    formData: FormData,
    expense: ServiceOrderExpenses,
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
            type: 'expense',
          },
        },
      )
      .then((response) => {
        if (response.data.status === 200 && selectedFile) {
          toast.success('Arquivo enviado com sucesso')
          const file: PharosFile = {
            fileId: response.data.fileId,
            fileName: selectedFile?.name,
            fileSize: selectedFile.size.toString(),
            fileUrl: response.data.downloadUrl,
          }

          const newExpense: ServiceOrderExpenses = {
            ...expense,
            fileId: response.data.fileId,
            file,
          }

          handleCreateServiceOrderDetailExpense(newExpense, newExpense?.index)
          reset()
          return
        }

        toast.error('Erro ao tentar enviar o arquivo')
      })
  }

  const handleOSExpensesFormSubmit: SubmitHandler<TOsExpensesFormData> = ({
    projectExpenseId,
    value,
  }: TOsExpensesFormData) => {
    const formmatedValue = parseFloat(value.replace('R$', '').replace(',', '.'))

    const isValueCorrect = selectedExpense
      ? formmatedValue <=
        parseFloat(selectedExpense?.value.replace('R$', '').replace(',', '.'))
      : false

    if (!isValueCorrect) {
      setError('value', {
        message: `Insira um valor até ${selectedExpense?.value}`,
      })

      return
    }

    if (isValueCorrect) {
      if (selectedFile) {
        const formData = new FormData()
        formData.append('file', selectedFile)
        handleUploadFile(formData, {
          projectExpenseId,
          value,
        })
      }
      if (!selectedFile) {
        handleCreateServiceOrderDetailExpense(
          {
            projectExpenseId,
            value,
          },
          expenseOpened?.index,
        )
      }
    }

    toast.success('Despesa criada com sucesso!')
    handleClearForm()

    setSelectedFile(null)
  }

  function handleClearForm() {
    reset({
      value: '',
      projectExpenseId: '',
    })

    setOpenExpenses(false)
    setExpenseOpened(undefined)
  }

  if (id && expenseOpened && !expenseOpened.value) {
    return <Loading />
  }

  return (
    <main className="w-full">
      <form
        onSubmit={handleSubmit(handleOSExpensesFormSubmit)}
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

        <section className="flex flex-wrap gap-6 justify-between">
          <Select
            label="Despesa"
            classNames={{
              trigger: 'bg-gray-700  data-[hover=true]:bg-gray-600 rounded-lg',
              listboxWrapper: 'max-h-[400px] rounded-lg',
              base: 'max-w-sm',
            }}
            listboxProps={{
              itemClasses: {
                base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
              },
            }}
            popoverProps={{
              classNames: {
                base: 'bg-gray-700 rounded-lg',
              },
            }}
            onSelectionChange={(keys) => handleFindProjectExpense(keys)}
            {...register('projectExpenseId')}
            errorMessage={errors.projectExpenseId?.message}
            isInvalid={!!errors.projectExpenseId}
            defaultSelectedKeys={
              expenseOpened && [expenseOpened.projectExpenseId]
            }
          >
            {projectExpenses.map((pExpenses) => (
              <SelectItem key={pExpenses.id}>
                {pExpenses.description}
              </SelectItem>
            ))}
          </Select>

          <Input
            label="Reembolso"
            id="value"
            classNames={{
              label: 'text-gray-300',
              base: 'max-w-sm',
              inputWrapper:
                'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
            }}
            {...register('value')}
            placeholder={selectedExpense?.value || (expenseOpened && ' ')}
            onChange={handleFormatCurrency}
            errorMessage={errors.value?.message}
            isInvalid={!!errors.value}
            endContent={<DollarSign className="text-gray-300" size={20} />}
          />

          <label
            htmlFor="reembolso_arqv"
            className="cursor-pointer max-w-sm text-gray-300 text-wrap text-sm relative w-full inline-flex tap-highlight-transparent shadow-sm px-3 min-h-unit-10 rounded-medium  items-center justify-between gap-0 transition-background motion-reduce:transition-none !duration-150 outline-none focus:z-10 h-14 py-2 bg-gray-700 hover:bg-gray-800 focus:bg-gray-800  focus:ring-yellow-500"
          >
            {selectedFile ? (
              <span className="text-gray-100">{selectedFile.name}</span>
            ) : (
              'Anexar nota fiscal'
            )}
            <FileUp className="text-gray-300" size={20} />

            <span className="absolute text-sm -bottom-6 left-1">
              Envie apenas arquivos .jpg .png e .pdf
            </span>
          </label>

          <input
            type="file"
            accept=".png,.jpg,.pdf"
            id="reembolso_arqv"
            className="sr-only"
            onChange={handleFileChange}
          />
        </section>
      </form>
    </main>
  )
}
