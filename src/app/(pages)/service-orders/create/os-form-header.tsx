import { Button } from '@nextui-org/react'
import { UploadCloud } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

interface OsFormHeaderProps {
  openDetails: boolean
  setOpenDetails: Dispatch<SetStateAction<boolean>>
  clientId: string | undefined
}

export function OsFormHeader({
  openDetails,
  clientId,
  setOpenDetails,
}: OsFormHeaderProps) {
  console.log(clientId)
  return (
    <section className="flex items-center justify-between">
      <span className="text-gray-200">Informações da ordem de serviço</span>
      <section className="space-x-6">
        <Button
          type="button"
          className="disabled:border-none min-w-fit items-center disabled:transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 text-gray-100 border-2 border-dashed border-gray-100 bg-transparent font-bold hover:bg-gray-100 hover:text-gray-700"
          disabled={!!(openDetails === true || clientId === undefined)}
          onClick={() => setOpenDetails(true)}
        >
          <UploadCloud size={16} />
          Adicionar Detalhamento
        </Button>
      </section>
    </section>
  )
}
