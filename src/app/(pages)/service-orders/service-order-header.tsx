import { ServiceOrderCard, ServiceOrderPage } from '@/types/service-order'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { DateFilter } from './filters/date-filter'
import { OsSearchFilter } from './filters/os-search-filter'
import { OsSupervisorFilter } from './filters/os-supervisor-filter'
import { OsStatusFilter } from './filters/os-status-filter'
import { MakeOsReport } from './make-os-report'
import { useUser } from '@/app/contexts/useUser'

export interface ServiceOrderHeaderProps {
  setServiceOrders: Dispatch<SetStateAction<ServiceOrderCard[]>>
  serviceOrderData: ServiceOrderPage | undefined
  serviceOrders: ServiceOrderCard[]
}

export function ServiceOrderHeader({
  serviceOrderData,
  setServiceOrders,
  serviceOrders,
}: ServiceOrderHeaderProps) {
  const { auth } = useUser()
  const [items, setItems] = useState<
    {
      key: string
      label: string
    }[]
  >([])
  const [collaborators, setCollaborators] = useState<
    {
      key: string
      label: string
    }[]
  >([])

  useEffect(() => {
    const newItems = [
      {
        key: 'all',
        label: 'Todos',
      },
      {
        key: 'me',
        label: 'Minhas',
      },
    ]

    if (serviceOrders) {
      serviceOrders.forEach((os) => {
        if (os.collaborator.supervisorId === auth?.user?.collaboratorId) {
          if (!newItems.find((item) => item.key === os.collaborator.id)) {
            newItems.push({
              key: os.collaborator.id,
              label: os.collaborator.name,
            })
          }
        }
      })

      setItems(newItems)
    }
  }, [])

  useEffect(() => {
    const updatedItems: {
      key: string
      label: string
    }[] = []

    if (items) {
      updatedItems.concat(items[0], items[1])

      const newCollaborators = [
        {
          key: auth?.user?.collaboratorId,
          label: auth?.user?.name,
        },
        ...updatedItems,
      ]

      setCollaborators(newCollaborators)
    }
  }, [])

  return (
    <>
      {serviceOrderData?.serviceOrders && (
        <DateFilter
          serviceOrderData={serviceOrderData}
          setServiceOrders={setServiceOrders}
        />
      )}

      <header className="flex items-center justify-between">
        <section className="flex w-full gap-6">
          <OsSearchFilter
            serviceOrders={serviceOrders}
            setServiceOrders={setServiceOrders}
          />

          {items.length > 0 && (
            <OsSupervisorFilter
              serviceOrders={serviceOrders}
              setServiceOrders={setServiceOrders}
              items={items}
              setCollaborators={setCollaborators}
              setItems={setItems}
            />
          )}

          <OsStatusFilter
            serviceOrders={serviceOrders}
            setServiceOrders={setServiceOrders}
          />

          <MakeOsReport collaborators={collaborators} />
        </section>
      </header>
    </>
  )
}
