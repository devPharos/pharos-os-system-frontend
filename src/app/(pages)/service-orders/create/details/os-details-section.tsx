import { Dispatch, SetStateAction } from 'react'
import { OSDetails } from '.'
import { ServiceOrderDetailsCard } from './os-details-card'

interface ServiceOrderDetailsSectionProps {
  details: OSDetails[]
  setDetailOpened: Dispatch<SetStateAction<OSDetails | undefined>>
  setOpenDetails: Dispatch<SetStateAction<boolean>>
}

export function ServiceOrderDetailsSection({
  details,
  setDetailOpened,
  setOpenDetails,
}: ServiceOrderDetailsSectionProps) {
  return (
    <section className="space-y-6">
      <span className="text-gray-200">Detalhes da ordem de serviço</span>

      <section className="flex flex-wrap items-center gap-6">
        {details.map((detail, index) => {
          if (detail) {
            return (
              <ServiceOrderDetailsCard
                setDetailOpened={setDetailOpened}
                detail={detail}
                index={index}
                setOpenDetails={setOpenDetails}
                key={index}
              />
            )
          }

          return null
        })}
      </section>
    </section>
  )
}
