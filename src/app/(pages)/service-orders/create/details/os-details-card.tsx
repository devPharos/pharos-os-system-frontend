import { Card } from '@/components/Card'
import { CircleDollarSign, Clock } from 'lucide-react'
import { OSDetails } from '.'
import { Dispatch, SetStateAction } from 'react'

interface ServiceOrderDetailsCardProps {
  detail: OSDetails
  setDetailOpened: Dispatch<SetStateAction<OSDetails | undefined>>
  setOpenDetails: Dispatch<SetStateAction<boolean>>
  index: number
}

export function ServiceOrderDetailsCard({
  detail,
  setDetailOpened,
  index,
  setOpenDetails,
}: ServiceOrderDetailsCardProps) {
  function handleOpenDetailForm() {
    const openedService = {
      ...detail,
      index,
    }

    setDetailOpened(openedService)
    setOpenDetails(true)
  }

  return (
    <Card.Root
      onClick={handleOpenDetailForm}
      className="hover:bg-gray-600 hover:border-2 hover:border-gray-500 min-w-fit max-w-sm"
    >
      <Card.Header>
        <Card.Title label={detail.project.name} />
        <Card.Badge
          className="text-yellow-500 bg-yellow-500/10"
          status={detail.project.service.description}
        />
      </Card.Header>
      <Card.Content>
        <Card.Info
          icon={Clock}
          info={detail.startDate + ' - ' + detail.endDate}
        />
        {detail.expenses.length > 0 && (
          <Card.Info
            icon={CircleDollarSign}
            info={`${detail.expenses.length} ${
              detail.expenses.length === 1 ? 'despesa' : 'despesas'
            }`}
          />
        )}
      </Card.Content>
    </Card.Root>
  )
}
