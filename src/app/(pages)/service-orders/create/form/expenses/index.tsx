'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  CircularProgress,
  Input,
  Select,
  SelectItem,
} from '@nextui-org/react'
import { DollarSign, FileUp, Save } from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { ChangeEvent, useEffect, useState } from 'react'
import axios from 'axios'
import { ProjectExpenses, ServiceOrderExpenses } from '@/types/service-order'
import { toast } from 'sonner'
import { PharosFile } from '@/types/file'
import { useUser } from '@/app/contexts/useUser'

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
  const { auth } = useUser()
  const [loading, setLoading] = useState(false)
  const [projectExpenses, setProjectExpenses] = useState<ProjectExpenses[]>([])
  const [projectExpense, setProjectExpense] = useState<ProjectExpenses>()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

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

  const handleUploadFile = async (
    formData: FormData,
    expense: ProjectExpenses,
  ) => {
    setLoading(true)
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

          const newExpense: ProjectExpenses = {
            ...expense,
            fileId: response.data.fileId,
            serviceOrderProjectExpensesFile: file,
          }

          handleExpenseSave(newExpense)
          reset()
          setLoading(false)
          return
        }

        toast.error('Erro ao tentar enviar o arquivo')
      })
  }

  const handleOSExpensesFormSubmit: SubmitHandler<TOsExpensesFormData> = (
    data: TOsExpensesFormData,
  ) => {
    setLoading(true)
    const exp = projectExpenses.find((exp) => exp.id === data.projectExpenseId)

    const isValueCorrect = projectExpense
      ? parseInt(data.value.replace(/\D/g, '')) <=
        parseInt(projectExpense?.value)
      : parseInt(data.value.replace(/\D/g, '')) <=
        parseInt(expense?.value || '')

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

      if (selectedFile) {
        const formData = new FormData()
        formData.append('file', selectedFile)
        handleUploadFile(formData, expense)
      }

      if (!selectedFile) {
        handleExpenseSave(expense)
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/project-expenses`, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
          projectid: projectId,
        },
      })
      .then((response) => {
        setLoading(false)
        setProjectExpenses(response.data.projectExpenses)
      })
  }, [projectId, auth?.token])

  const handleSelectProject = (selectedKey: any) => {
    setLoading(true)
    const selectedExpenseId = selectedKey.currentKey

    const expense = projectExpenses.find(
      (expense) => expense.id === selectedExpenseId,
    )

    if (expense) {
      setLoading(false)
      setProjectExpense(expense)
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files && event.target.files[0]
      setSelectedFile(file)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleOSExpensesFormSubmit)}
      className="max-w-7xl w-full space-y-10 px-6"
      encType="multipart/form-data"
    >
      <section className={'flex flex-col gap-6'}>
        <header className={'flex items-center justify-between'}>
          <span className="text-xl font-bold text-white">Despesas</span>

          <section className="flex items-center gap-6">
            <Button
              disabled={loading}
              type="submit"
              className="disabled:border-none disabled:bg-transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 hover:text-gray-700 text-yellow-500 font-bold bg-transparent border-2 border-dashed border-yellow-500 hover:bg-yellow-500"
            >
              {loading ? (
                <CircularProgress
                  classNames={{
                    svg: 'w-4 h-4',
                  }}
                />
              ) : (
                <Save size={16} />
              )}
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
      </section>
    </form>
  )
}
