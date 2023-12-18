import { Project } from '@/types/projects'
import { Key } from 'react'

export const parseDate = (date: string): Date => {
  const [hours, minutes] = date.split(':').map(Number)
  const newDate = new Date()
  newDate.setHours(hours)
  newDate.setMinutes(minutes)

  return newDate
}

interface FilterProps {
  status?: Key | null
  search?: string
  array: Project[]
  setArray: React.Dispatch<React.SetStateAction<Project[]>>
}

export const onFilter = ({
  status = null,
  search = '',
  array,
  setArray,
}: FilterProps) => {
  const filteredItem = array.map((item) => {
    item.hide = true

    if (status) {
      if (item.status === status || status === 'Limpar') {
        item.hide = false
      }
    }

    if (search) {
      if (item.name.includes(search)) {
        item.hide = false
      }
    }

    if (!search && !status) {
      item.hide = false
    }

    return item
  })

  setArray(filteredItem)
}
