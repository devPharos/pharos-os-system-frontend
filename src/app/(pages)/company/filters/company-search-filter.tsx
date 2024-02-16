import { Collaborator } from '@/types/collaborator'
import { Input } from '@nextui-org/react'
import { Search } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

export interface CompanySearchFilterProps {
  collaborators: Collaborator[]
  setCollaborators: Dispatch<SetStateAction<Collaborator[]>>
}

export function CompanySearchFilter({
  collaborators,
  setCollaborators,
}: CompanySearchFilterProps) {
  const onStatusFilter = ({ search = '' }: { search?: string }) => {
    const newFilteredClients = collaborators.map((collaborator) => {
      collaborator.hide = true

      if (search) {
        if (collaborator.name.toLowerCase().includes(search)) {
          collaborator.hide = false
        }
      }

      if (!search) {
        collaborator.hide = false
      }

      return collaborator
    })

    setCollaborators(newFilteredClients)
  }

  return (
    <Input
      placeholder="Buscar"
      startContent={<Search className="w-5 h-5 text-gray-300" />}
      classNames={{
        label: 'font-semibold text-gray-300',
        inputWrapper:
          'bg-transparent border border-1 rounded-lg border-gray-300 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 px-4 py-2',
      }}
      onValueChange={(search) => onStatusFilter({ search })}
    />
  )
}
