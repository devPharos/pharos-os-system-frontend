import { Button } from '@nextui-org/react'
import { UploadCloud, DollarSign } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

interface ProjectInfoHeaderProps {
  openService: boolean
  setOpenService: Dispatch<SetStateAction<boolean>>
  openExpense: boolean
  setOpenExpense: Dispatch<SetStateAction<boolean>>
}

export function ProjectInfoHeader({
  openExpense,
  openService,
  setOpenExpense,
  setOpenService,
}: ProjectInfoHeaderProps) {
  return (
    <section className="flex items-center justify-between">
      <span className="text-gray-200">Informações do projeto</span>
      <section className="space-x-6">
        <Button
          type="button"
          className="disabled:border-none min-w-fit items-center disabled:transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 text-gray-100 border-2 border-dashed border-gray-100 bg-transparent font-bold hover:bg-gray-100 hover:text-gray-700"
          disabled={openService}
          onClick={() => setOpenService(true)}
        >
          <UploadCloud size={16} />
          Adicionar serviço
        </Button>
        <Button
          type="button"
          className="disabled:border-none min-w-fit items-center disabled:transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 text-gray-100 border-2 border-dashed border-gray-100 bg-transparent font-bold hover:bg-gray-100 hover:text-gray-700"
          disabled={openExpense}
          onClick={() => setOpenExpense(true)}
        >
          <DollarSign size={16} />
          Adicionar despesa
        </Button>
      </section>
    </section>
  )
}
