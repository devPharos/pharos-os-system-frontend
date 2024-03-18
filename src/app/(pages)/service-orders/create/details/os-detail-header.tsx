import { Button } from '@nextui-org/react'
import { DollarSign } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

interface OsFormHeaderProps {
  openExpenses: boolean
  setOpenExpenses: Dispatch<SetStateAction<boolean>>
  selectedProject: string | undefined
}

export function OsDetailsFormHeader({
  openExpenses,
  setOpenExpenses,
  selectedProject,
}: OsFormHeaderProps) {
  return (
    <section className="flex items-center justify-between">
      <span className="text-gray-200">Informações do detalhamento</span>
      <section className="space-x-6">
        <Button
          type="button"
          className="disabled:border-none min-w-fit items-center disabled:transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 text-gray-100 border-2 border-dashed border-gray-100 bg-transparent font-bold hover:bg-gray-100 hover:text-gray-700"
          disabled={openExpenses || !selectedProject}
          onClick={() => setOpenExpenses(true)}
        >
          <DollarSign size={16} />
          Adicionar Despesa
        </Button>
      </section>
    </section>
  )
}
