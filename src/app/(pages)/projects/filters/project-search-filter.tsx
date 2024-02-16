'use client'
import { Project } from '@/types/projects'
import { Input } from '@nextui-org/react'
import { Search } from 'lucide-react'
import { Dispatch, Key, SetStateAction } from 'react'

export interface ProjectSearchFilterProps {
  projects: Project[]
  setProjects: Dispatch<SetStateAction<Project[]>>
}

export function ProjectSearchFilter({
  projects,
  setProjects,
}: ProjectSearchFilterProps) {
  const onFilter = ({
    status = null,
    search = '',
  }: {
    status?: Key | null
    search?: string
  }) => {
    const filteredItem = projects.map((item) => {
      item.hide = true

      if (status) {
        if (item.status === status || status === 'Limpar') {
          item.hide = false
        }
      }

      if (search) {
        if (item.name.toLowerCase().includes(search)) {
          item.hide = false
        }
      }

      if (!search && !status) {
        item.hide = false
      }

      return item
    })

    setProjects(filteredItem)
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
      onValueChange={(search) => onFilter({ search })}
    />
  )
}
